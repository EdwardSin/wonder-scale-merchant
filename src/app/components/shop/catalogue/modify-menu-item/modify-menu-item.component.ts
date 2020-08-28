import { CdkDragDrop, moveItemInArray, CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { environment } from '@environments/environment';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthDefaultSettingContributorService } from '@services/http/auth-shop/contributor/auth-default-setting-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import _ from 'lodash';
import { from, of, Subject, forkJoin } from 'rxjs';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { RoutePartsService } from '@services/general/route-parts.service';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';

@Component({
  selector: 'app-modify-menu-item',
  templateUrl: './modify-menu-item.component.html',
  styleUrls: ['./modify-menu-item.component.scss']
})
export class ModifyMenuItemComponent implements OnInit {
  itemGroup: FormGroup;
  shop;
  currentItem;
  tempItem;
  isTypeFields: boolean;
  currencies = [];
  allProfileItems = [];
  allTypes = [];
  defaultType = { name: 'Normal (default)', incrementType: true, amount: 0 };
  allDescriptionItems = [];
  categories = [];
  environment = environment;
  loading: WsLoading = new WsLoading;
  addItemLoading: WsLoading = new WsLoading;
  //selectedType: ItemType;
  selectedTypeIndex: number;
  private ngUnsubscribe: Subject<any> = new Subject;
  @ViewChild('itemProfileUpload', { static: false }) itemProfileUpload: ElementRef;
  @ViewChild('itemDescriptionUpload', { static: false }) itemDescriptionUpload: ElementRef;
  @ViewChild('targetNameRef', { static: false }) targetNameRef: ElementRef;
  profileImageIndex = 0;
  itemId;
  profileImageName;
  isExpanded: boolean;
  defaultSetting = {
    is__new: true,
    isInStock: true,
    isPriceDisplayed: true,
    isPublished: true,
    isPickup: false,
    isEcommerce: false,
    currency: 'MYR'
  }


  constructor(private sharedShopService: SharedShopService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private uploadHelper: UploadHelper,
    private sharedCategoryService: SharedCategoryService,
    private routePartsService: RoutePartsService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private authDefaultSettingContributorService: AuthDefaultSettingContributorService,
    private authItemContributorService: AuthItemContributorService) {
    this.loading.start();
    this.getCurrency();
    this.itemGroup = WSFormBuilder.createMenuItemForm();
  }
  ngOnInit() {
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.shop = result;
        // this.itemGroup.get('currency').setValue(this.shop.currency);
        this.getDefaultSetting();
      }
    });
    this.getItem();
    this.getCategories();
  }
  getItem() {
    let itemId = this.route.snapshot.queryParams['id'];
    if (itemId) {
      this.authItemContributorService.getItemById(itemId).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          if (result) {
            this.currentItem = result['result'];
            this.setupItemForm(this.currentItem);
          }
        })
    }
  }
  getCategories() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.categories = result['result'];
        this.setDefaultCategory(this.categories);
      })
  }
  getCurrency() {
    var currencyFullName = Constants.currencyFullnames;
    var currencySymbols = Constants.currencySymbols;
    this.currencies = Object.keys(currencyFullName).map(name => {
      return {
        name,
        symbol: currencySymbols[name]
      }
    });
  }
  getDefaultSetting() {
    this.authDefaultSettingContributorService.getDefaultItemSettingByShopId().pipe(takeUntil(this.ngUnsubscribe), finalize(() => _.delay(() => { this.loading.stop(); }, 500)))
      .subscribe(result => {
        if (result) {
          this.defaultSetting = <any>result;
          this.setupDefaultSetting();
        }
      })
  }
  setDefaultCategory(categories) {
    let routeParts = this.routePartsService.generateRouteParts(this.route.root.snapshot);
    if (routeParts[1]['title'] == 'cat') {
      let categoryName = RoutePartsService.parseText(routeParts[0]);
      let category = categories.find(category => category.name == categoryName);
      if (category) {
        this.itemGroup.controls['categories'].setValue([category._id]);
      }
    }
  }
  setupDefaultSetting() {
    this.itemGroup.patchValue({
      ...this.defaultSetting,
      // currency: this.defaultSetting.currency || this.shop.currency
    });
    if (this.currentItem) {
      this.itemGroup.patchValue({ ...this.currentItem });
    }
  }
  validateBasicForm() {
    let refId = this.itemGroup.get('refId');
    let name = this.itemGroup.get('name');
    let price = this.itemGroup.get('price');
    let discount = this.itemGroup.get('discount');
    let quantity = this.itemGroup.get('quantity');
    let description = this.itemGroup.get('description');
    let priceRegex = /^\d*(?:\.\d{1,2})?$/;
    let intergerRegex = /^\d+$/;
    if (refId.errors && refId.errors.required) {
      WsToastService.toastSubject.next({ content: 'ID is required!', type: 'danger' });
      return false;
    }
    else if (refId.errors && refId.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'ID is too long. Max 36 characters!', type: 'danger' });
      return false;
    }
    else if (name.errors && name.errors.required) {
      WsToastService.toastSubject.next({ content: 'Product name is required!', type: 'danger' });
      return false;
    } else if (name.errors && name.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Product name is too long. Max 128 characters!', type: 'danger' });
      return false;
    }
    else if (price.errors && price.errors.required) {
      WsToastService.toastSubject.next({ content: 'Price is required!', type: 'danger' });
      return false;
    }
    else if (price.value && !priceRegex.test(price.value)) {
      WsToastService.toastSubject.next({ content: 'Price is invalid!', type: 'danger' });
      return false;
    }
    else if (discount.value && (!priceRegex.test(discount.value) || +discount.value > 100)) {
      WsToastService.toastSubject.next({ content: 'Discount is invalid!', type: 'danger' });
      return false;
    }
    else if (quantity.value && !intergerRegex.test(quantity.value)) {
      WsToastService.toastSubject.next({ content: 'Quantity is invalid!', type: 'danger' });
      return false;
    } else if (quantity.value && +quantity.value > 999999) {
      WsToastService.toastSubject.next({ content: 'Quantity should less than 999999!', type: 'danger' });
      return false;
    }
    else if (description.errors && description.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Description is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    return true;
  }
  setupItemForm(item) {
    this.itemGroup.patchValue(item);
    this.itemId = item['_id'];
    this.profileImageIndex = item['profileImageIndex'] > -1 ? item['profileImageIndex'] : 0;
    this.allTypes = item.types;
    this.allProfileItems = item.profileImages.map(image => { return { name: image, type: 'url' } });
    this.allDescriptionItems = item.descriptionImages.map(image => { return { name: image, type: 'url' } });
    this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].name : '';
  }
  addItem() {
    let currentItem = {
      ...this.itemGroup.value,
      kind: 'food',
      types: this.allTypes,
      profileImageIndex: this.profileImageIndex
    }
    return this.authItemContributorService.addItem(currentItem);
  }
  editItem() {
    let currentItem = {
      ...this.currentItem,
      ...this.itemGroup.value,
      types: this.allTypes,
      profileImageIndex: this.profileImageIndex
    },
      allProfileItems = [],
      allDescriptionItems = [];
    if (this.allProfileItems.length) {
      allProfileItems = this.allProfileItems.filter(x => x.type == 'url');
    }
    if (this.allDescriptionItems.length) {
      allDescriptionItems = this.allDescriptionItems.filter(x => x.type == 'url');
    }
    currentItem.profileImages = allProfileItems.map(x => x.name);
    currentItem.descriptionImages = allDescriptionItems.map(x => x.name);
    return this.authItemContributorService.editItem(currentItem);
  }
  uploadAndAddItem() {
    if (this.validateBasicForm()) {
      this.addItemLoading.start();
      this.addItem().pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((result) =>
          forkJoin((() => {
            this.itemId = result['result']['_id'];
            this.tempItem = result['result'];
            return this.allProfileItems.length ? this.uploadProfileImages(this.allProfileItems) : of(0);
          })(), (() => {
            return this.allDescriptionItems.length ? this.uploadDescriptionImages(this.allDescriptionItems) : of(0);
          })())
        ),
        finalize(() => { this.addItemLoading.stop() }))
        .subscribe(result => {
          this.router.navigate([], { queryParams: { id: null, modal: null }, queryParamsHandling: 'merge' });
          this.sharedCategoryService.refreshCategories();
        }, err => {
          if (err.error.code == 11000) {
            WsToastService.toastSubject.next({ content: 'ID already exists!', type: 'danger' });
          } else {
            WsToastService.toastSubject.next({ content: err.error.message || 'Error when creating item!', type: 'danger' });
          }
        });
    }
  }
  uploadAndEditItem() {
    if (this.validateBasicForm()) {
      this.addItemLoading.start();
      this.editItem().pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((result) =>
          forkJoin((() => {
            let profileItems = this.allProfileItems.filter(x => x.type == 'blob');
            return profileItems.length ? this.uploadProfileImages(profileItems) : of(0);
          })(), (() => {
            let descriptionItems = this.allDescriptionItems.filter(x => x.type == 'blob');
            return descriptionItems.length ? this.uploadDescriptionImages(descriptionItems) : of(0);
          })())
        ),
        finalize(() => { this.addItemLoading.stop(); }))
        .subscribe(result => {
          this.sharedCategoryService.refreshCategories();
          this.router.navigate([], { queryParams: { id: null, modal: null }, queryParamsHandling: 'merge' });
        }, err => {
          if (err.error.code == 11000) {
            WsToastService.toastSubject.next({ content: 'ID already exists!', type: 'danger' });
          } else {
            WsToastService.toastSubject.next({ content: err.error.message || 'Error when editing item!', type: 'danger' });
          }
        });
    }
  }
  onProfileImageUploaded(event) {
    if (!this.profileImageName) {
      this.profileImageName = event[0].name;
    }
    event.forEach(item => {
      if (!this.allProfileItems.includes(item)) {
        this.allProfileItems.push(item);
      }
    });
  }
  onDescriptionImageUploaded(event) {
    event.forEach(item => {
      if (!this.allDescriptionItems.includes(item)) {
        this.allDescriptionItems.push(item);
      }
    });
  }
  uploadProfileImages(uploadProfileItems) {
    uploadProfileItems.forEach(image => { image.loading = true; })
    return from(uploadProfileItems)
      .pipe(mergeMap(image => {
        let index = this.allProfileItems.indexOf(image);
        let obj = {
          id: image['id'],
          file: image['base64'],
          profileImageIndex: this.profileImageIndex,
          itemId: this.itemId,
          position: index
        };
        return this.authItemContributorService.editProfileImage(obj);
      }), map(result => {
        this.doneUpload(uploadProfileItems, result['id'], result['filename'])
        return 'done';
      }));
  }
  uploadDescriptionImages(uploadDescriptionItems) {
    uploadDescriptionItems.forEach(image => { image.loading = true; });
    return from(uploadDescriptionItems)
      .pipe(mergeMap(image => {
        let index = this.allDescriptionItems.indexOf(image);
        let obj = {
          id: image['id'],
          file: image['base64'],
          itemId: this.itemId,
          position: index
        };
        return this.authItemContributorService.editDescriptionImage(obj)
      }),
        map(result => {
          this.doneUpload(uploadDescriptionItems, result['id'], result['filename'])
          return 'done';
        }));
  }
  removeProfileImage(filename) {
    var file = ImageHelper.getUploadProfileItem(this.allProfileItems, filename);

    if (file) {
      if (file.type == 'blob') {
        let removeIndex = this.allProfileItems.indexOf(file);
        this.profileImageIndex = ImageHelper.getRemoveProfileImageIndex(this.allProfileItems.length, removeIndex, this.profileImageIndex);
        _.remove(this.allProfileItems, (x) => x == file);
        this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].name : '';
      }
      else {
        let result = confirm('Are you sure to remove?');
        if (result) {
          let obj = {
            itemId: this.currentItem._id,
            filename: file.name
          }
          this.authItemContributorService.removeProfileImage(obj).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              let removeIndex = this.allProfileItems.indexOf(file);
              this.profileImageIndex = ImageHelper.getRemoveProfileImageIndex(this.allProfileItems.length, removeIndex, this.profileImageIndex);
              this.allProfileItems = this.allProfileItems.filter(x => x.name != filename);
              this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].name : '';
            });
        }
      }
    } else {
      WsToastService.toastSubject.next({ content: 'Image is not found!', type: 'danger' });
    }
  }
  removeDescriptionImage(filename) {
    var file = ImageHelper.getUploadProfileItem(this.allDescriptionItems, filename);
    if (file) {
      if (file.type == 'blob') {
        _.remove(this.allDescriptionItems, (x) => x.name == filename);
        file['done'] = false;
      }
      else {
        let result = confirm('Are you sure to remove?');
        if (result) {
          let obj = {
            itemId: this.currentItem._id,
            filename: file.name
          }
          this.authItemContributorService.removeDescriptionImage(obj).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              this.allDescriptionItems = this.allDescriptionItems.filter(x => x.name != filename);
            });
        }
      }
    } else {
      WsToastService.toastSubject.next({ content: 'Image is not found!', type: 'danger' });
    }
  }
  doneUpload(allItems, _id, filename) {
    var item = allItems.find(item => item.id == _id);
    if (item) {
      item.done = true;
      item.filename = filename;
    }
  }
  selectProfileImage(name) {
    this.profileImageName = name;
    this.profileImageIndex = this.allProfileItems.findIndex(x => x.name == this.profileImageName);
  }
  dropDescription(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allDescriptionItems, event.previousIndex, event.currentIndex);
  }
  dropType(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allTypes, event.previousIndex, event.currentIndex);
  }
  removeType(type) {
    this.allTypes = this.allTypes.filter(_type => _type.name !== type.name);
  }
  addType(form) {
    if (!form.value.name || form.value.name.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter type name!', type: 'danger' });
    } else if (form.value.incrementType != 'add' && form.value.incrementType != 'minus') {
      WsToastService.toastSubject.next({ content: 'Please select either (+) or (-) !', type: 'danger' });
    } else if (!form.value.amount || form.value.amount < 0) {
      WsToastService.toastSubject.next({ content: 'Please enter amount!', type: 'danger' });
    } else {
      if (!this.allTypes.find(_type => _type.name == form.value.name.trim())) {
        this.allTypes.push({
          name: form.value.name.trim(),
          incrementType: form.value.incrementType == 'add',
          amount: form.value.amount
        });
        this.isTypeFields = false;
        form.reset();
      } else {
        WsToastService.toastSubject.next({ content: 'Type already exists!', type: 'danger' });
      }
    }
  }
  openTypeField() {
    this.isTypeFields = true;
    this.ref.detectChanges();
    this.targetNameRef.nativeElement.focus();
  }
  closeTypeField(form) {
    this.isTypeFields = false;
    form.reset();
  }
  async onSelect(event) {
    let items = await this.uploadHelper.fileChangeEvent(event.addedFiles);
    if (!this.profileImageName) {
      this.profileImageName = items[0].name;
    }
    for(let item of items) {
      if (!this.allProfileItems.includes(item) && this.allProfileItems.length < 5) {
        this.allProfileItems.push(item);
      } else {
        WsToastService.toastSubject.next({ content: 'Maximum images are uploaded!', type: 'danger'});
        break;
      }
    }
  }
  onDragEnter(event) {
    $('.upload-profile-images__drop-area').css({'z-index': 2});
  }
  onDrop(event) {
    $('.upload-profile-images__drop-area').css({'z-index': 0});
  }
  onChoose = () => {
    // using anonymous function to access the current prototype variable
    $('.upload-profile-images__container').css({'z-index': 3});
  }
  onUnchoose = (event) => {
    // using anonymous function to access the current prototype variable
    $('.upload-profile-images__container').css({'z-index': 0});
    $('.upload-profile-images__drop-area').css({'z-index': 0});
  }
}