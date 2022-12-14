import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { environment } from '@environments/environment';
import { AuthCategoryContributorService } from '@services/http/auth-store/contributor/auth-category-contributor.service';
import { AuthDefaultSettingContributorService } from '@services/http/auth-store/contributor/auth-default-setting-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import _ from 'lodash';
import { from, of, Subject, forkJoin } from 'rxjs';
import { finalize, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { RoutePartsService } from '@services/general/route-parts.service';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';


@Component({
  selector: 'modify-item',
  templateUrl: './modify-item.component.html',
  styleUrls: ['./modify-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifyItemComponent implements OnInit {
  itemGroup: FormGroup;
  store;
  currentItem;
  tempItem;
  allProfileItems = [];
  allDescriptionItems = [];
  categories = [];
  selectedTab = new FormControl(0);
  environment = environment;
  loading: WsLoading = new WsLoading;
  addItemLoading: WsLoading = new WsLoading;
  //selectedType: ItemType;
  selectedTypeIndex: number;
  validateItemTypesForm: Function;
  editItemTypesFunction: Function;
  private ngUnsubscribe: Subject<any> = new Subject;
  @ViewChild('categoryMatSelect', { static: false }) categoryMatSelect: ElementRef;
  @ViewChild('itemProfileUpload', { static: false }) itemProfileUpload: ElementRef;
  @ViewChild('itemDescriptionUpload', { static: false }) itemDescriptionUpload: ElementRef;
  profileImageIndex = 0;
  itemId;
  profileImageName;
  isRefreshCategories: boolean;
  isEditCategoryOpened: boolean;
  editLoading: WsLoading = new WsLoading();
  editingName: string;
  defaultSetting = {
    is__new: true,
    isInStock: true,
    isPriceDisplayed: true,
    isPickup: false,
    isEcommerce: false,
    currency: 'MYR'
  }

  constructor(private sharedStoreService: SharedStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadHelper: UploadHelper,
    private sharedCategoryService: SharedCategoryService,
    private routePartsService: RoutePartsService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private authDefaultSettingContributorService: AuthDefaultSettingContributorService,
    private authItemContributorService: AuthItemContributorService) {
      this.loading.start();
      this.itemGroup = WsFormBuilder.createItemForm();
  }

  ngOnInit() {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        // this.itemGroup.get('currency').setValue(this.store.currency);
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
          if(result) {
            this.currentItem = result['result'];
            this.setupItemForm(this.currentItem);
          }
        })
    }
  }
  getCategories() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByStoreId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.categories = result['result'];
        this.setDefaultCategory(this.categories);
      })
  }
  getDefaultSetting() {
    this.authDefaultSettingContributorService.getDefaultItemSettingByStoreId().pipe(takeUntil(this.ngUnsubscribe), finalize(() => _.delay(() => { this.loading.stop();}, 500)))
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
      if (category && !this.currentItem) {
        this.itemGroup.controls['categories'].setValue([category._id]);
      }
    }
  }
  setupDefaultSetting() {
    this.itemGroup.patchValue({
      ...this.defaultSetting,
      // currency: this.defaultSetting.currency || this.store.currency
    });
    if(this.currentItem) {
      this.itemGroup.patchValue({...this.currentItem});
    }
  }
  validateBasicForm() {
    let refId = this.itemGroup.get('refId');
    let name = this.itemGroup.get('name');
    let price = this.itemGroup.get('price');
    // let discount = this.itemGroup.get('discount');
    let weight = this.itemGroup.get('weight');
    let quantity = this.itemGroup.get('quantity');
    let description = this.itemGroup.get('description');
    let warranty = this.itemGroup.get('warranty');
    let brand = this.itemGroup.get('brand');
    let priceRegex = /^\d*(?:\.\d{1,2})?$/;
    let intergerRegex = /^\d+$/;
    if (refId.errors && refId.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'SKU is too long. Max 36 characters!', type: 'danger' });
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
    else if (price.value && !priceRegex.test(price.value)){
      WsToastService.toastSubject.next({ content: 'Price is invalid!', type: 'danger' });
      return false;
    } 
    // else if (discount.value && (!priceRegex.test(discount.value) || +discount.value > 100)){
    //   WsToastService.toastSubject.next({ content: 'Discount is invalid!', type: 'danger' });
    //   return false;
    // }
    else if (weight.value && !priceRegex.test(weight.value)){
      WsToastService.toastSubject.next({ content: 'Weight is invalid!', type: 'danger' });
      return false;
    }
    else if (quantity.value && !intergerRegex.test(quantity.value)){
      WsToastService.toastSubject.next({ content: 'Quantity is invalid!', type: 'danger' });
      return false;
    } else if(quantity.value && +quantity.value > 999999) {
      WsToastService.toastSubject.next({ content: 'Quantity should less than 999999!', type: 'danger' });
      return false;
    }
    else if (description.errors && description.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Description is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    else if (brand.errors && brand.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Brand is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    else if (warranty.errors && warranty.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Warranty is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    return true;
  }
  setupItemForm(item) {
    this.itemGroup.patchValue(item);
    this.itemId = item['_id'];
    this.profileImageIndex = item['profileImageIndex'] > -1 ? item['profileImageIndex']: 0;
    this.allProfileItems = item.profileImages.map(image => { return { name: image, type: 'url' } });
    this.allDescriptionItems = item.descriptionImages.map(image => { return { name: image, type: 'url' } });
    this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].name : ''; 
  }
  addItem() {
    let currentItem = {
      ...this.itemGroup.value,
      profileImageIndex: this.profileImageIndex
    }
    return this.authItemContributorService.addItem(currentItem);
  }
  editItem() {
    let currentItem = {
      ...this.currentItem,
      ...this.itemGroup.value,
      refId: this.itemGroup.value.refId || null,
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
    if (this.validateBasicForm() && this.validateItemTypesForm()) {
      this.addItemLoading.start();
      this.addItem().pipe(takeUntil(this.ngUnsubscribe), 
        tap((result) => {
          this.tempItem = result['result'];
          this.itemId = this.tempItem['_id'];
        }),
        mergeMap(() =>
          forkJoin([(() => {
            return this.allProfileItems.length ? this.uploadProfileImages(this.allProfileItems) : of(0);
          })(), (() => {
            return this.allDescriptionItems.length ? this.uploadDescriptionImages(this.allDescriptionItems) : of(0);
          })()])
      ),
      switchMap(() => {
        return this.editItemTypesFunction(this.tempItem['_id']);
      }),
      finalize(() => { this.addItemLoading.stop() }))
      .subscribe(() => {
        this.currentItem = this.tempItem;
        this.isRefreshCategories = true;
        this.closeModifyItemModal();
      }, err => {
        let message = err.error && err.error.message ? err.error.message : 'Error when creating items!';
        WsToastService.toastSubject.next({ content: message, type: 'danger' });
      });
    }
  }
  uploadAndEditItem() {
    if (this.validateBasicForm() && this.validateItemTypesForm()) {
      this.addItemLoading.start();
      this.editItem().pipe(takeUntil(this.ngUnsubscribe),
        mergeMap(() => 
          forkJoin([(() => {
            let profileItems = this.allProfileItems.filter(x => x.type == 'blob');
          return profileItems.length ? this.uploadProfileImages(profileItems) : of(0);
          })(), (() => {
            let descriptionItems = this.allDescriptionItems.filter(x => x.type == 'blob');
            return descriptionItems.length ? this.uploadDescriptionImages(descriptionItems) : of(0);
          })()])
      ),
      switchMap(() => {
        return this.editItemTypesFunction(this.currentItem['_id']);
      }),
      finalize(() => { this.addItemLoading.stop(); }))
      .subscribe(() => {
        this.isRefreshCategories = true;
        this.closeModifyItemModal();
      }, err => {
        let message = err.error && err.error.message ? err.error.message : 'Error when editing items!';
        WsToastService.toastSubject.next({ content: message, type: 'danger' });
      });
    }
  }
  onProfileImageUploaded(event) {
    if (!this.profileImageName) {
      this.profileImageName = event[0].name;
    }
    for (let image of event) {
      const result = this.uploadHelper.validate(image.file, true, environment.MAX_IMAGE_SIZE_IN_MB);
      if (result.result) {
        this.allProfileItems = _.uniq([...this.allProfileItems, image]);
      } else {
        WsToastService.toastSubject.next({ content: result.error, type: 'danger'});
      }
    }
  }
  onProfileImageOverflow() {
    WsToastService.toastSubject.next({ content: 'Max 5 images are uploaded!', type: 'danger'});
  }
  onDescriptionImageUploaded(event) {
    event.forEach(item => {
      ImageHelper.resizeImage(item.base64, null, null, .5).then(result => {
        if (!this.allDescriptionItems.includes(item)) {
          item.base64 = result;
          this.allDescriptionItems.push(item);
        }
      });
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
      if(file.type == 'blob') {
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
              this.isRefreshCategories = true;
              let removeIndex = this.allProfileItems.indexOf(file);
              this.profileImageIndex = ImageHelper.getRemoveProfileImageIndex(this.allProfileItems.length, removeIndex, this.profileImageIndex);
              this.allProfileItems = this.allProfileItems.filter(x => x.name != filename);
              this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].name : '';
            });
        }
      }
    } else {
      WsToastService.toastSubject.next({content: 'Image is not found!', type: 'danger'});
    }
  }
  removeDescriptionImage(filename) {
    var file = ImageHelper.getUploadProfileItem(this.allDescriptionItems, filename);
    if (file) {
        if(file.type == 'blob') {
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
              this.isRefreshCategories = true;
              this.allDescriptionItems = this.allDescriptionItems.filter(x => x.name != filename);
            });
        }
      }
    } else {
      WsToastService.toastSubject.next({content: 'Image is not found!', type: 'danger'});
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
  async onSelect(event) {
    let items = await this.uploadHelper.fileChangeEvent(event.addedFiles);
    if (!this.profileImageName) {
      this.profileImageName = items[0].name;
    }
    for(let item of items) {
      if (!this.allProfileItems.includes(item) && this.allProfileItems.length < 5) {
        const result = this.uploadHelper.validate(item.file, true, environment.MAX_IMAGE_SIZE_IN_MB);
        if (result.result) {
          this.allProfileItems.push(item);
        } else {
          WsToastService.toastSubject.next({ content: result.error, type: 'danger'});
        }
      } else {
        WsToastService.toastSubject.next({ content: 'Max 5 images are uploaded!', type: 'danger'});
        break;
      }
    }
  }
  closeModifyItemModal() {
    if (this.isRefreshCategories) {
      this.sharedCategoryService.refreshCategories();
    }
    this.router.navigate([], {queryParams: {id: null, modal: null}, queryParamsHandling:'merge'});
  }
  onRefreshCallback(event) {
    this.isRefreshCategories = event;
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
  onSort = () => {
    this.profileImageIndex = this.allProfileItems.findIndex(x => x.name == this.profileImageName);
  }
  addCategory() {
    if (this.isValidated(this.editingName)) {
      let obj = {
        name: this.editingName
      };
      this.editLoading.start();
      this.authCategoryContributorService
        .addCategory(obj)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editLoading.stop()))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: 'Category is added!', type: 'success' });
          result['result'].items = [];
          this.categories.push(result['result']);
          this.editingName = '';
          this.isEditCategoryOpened = false;
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  isValidated(name) {
    if (name == '' || name.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Category name is invalid!', type: 'danger' });
      return false;
    } else if (name.length > 32) {
      WsToastService.toastSubject.next({ content: 'Category name is too long!', type: 'danger' });
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
