import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { environment } from '@environments/environment';
import { ItemType } from '@wstypes/item.type';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthDefaultSettingContributorService } from '@services/http/auth-shop/contributor/auth-default-setting-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';
import _ from 'lodash';
import { from, of, Subject } from 'rxjs';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'modify-item',
  templateUrl: './modify-item.component.html',
  styleUrls: ['./modify-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModifyItemComponent implements OnInit {
  itemGroup: FormGroup;
  ecommerceGroup: FormGroup;
  shop;
  currentItem;
  tempItem;
  currencies = [];
  allProfileItems = [];
  allDescriptionItems = [];
  categories = [];
  selectedCategory;
  environment = environment;
  loading: WsLoading = new WsLoading;
  //selectedType: ItemType;
  selectedTypeIndex: number;
  private ngUnsubscribe: Subject<any> = new Subject;
  @ViewChild('itemProfileUpload', { static: false }) itemProfileUpload: ElementRef;
  @ViewChild('itemDescriptionUpload', { static: false }) itemDescriptionUpload: ElementRef;
  profileImageIndex = 0;
  isSetEcommerce: Boolean = false;
  item_id;
  profileImageName;
  itemTypes: Array<ItemType> = [];
  defaultSetting = {
    is__new: true,
    isInStock: true,
    isPriceDisplayed: true,
    isMarkedAsPublished: true,
    isPickup: false,
    isEcommerce: false,
    currency: 'MYR'
  }

  constructor(private sharedShopService: SharedShopService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private sharedCategoryService: SharedCategoryService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private authDefaultSettingContributorService: AuthDefaultSettingContributorService,
    private authItemContributorService: AuthItemContributorService) {
    this.getCurrency();
    this.createItemGroup();
    this.createEcommerceGroup();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(param => {
      if (param.colorName) {
        this.ecommerceGroup.value['color'] = param.colorName || 'Color';
        this.ecommerceGroup.value['hexColor'] = param.colorName || '';
      }
      else if (param.url) {
        this.ecommerceGroup.value['image'] = param.url || '';
      }
    })
  }

  ngOnInit() {
    this.setItemSettings();
    this.getDefaultSetting();
    this.getItem();
    this.getCategories();
  }
  getCategory() {
    this.sharedShopService.selectedCategory.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.selectedCategory = result;
      }
    })
  }
  getItem() {
    let item_id = this.route.snapshot.queryParams['id'];
    if (item_id) {
      this.authItemContributorService.getItemById(item_id).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.currentItem = result;
          this.setupItemForm(this.currentItem);
        })
    }
  }
  getCategories() {
    this.authCategoryContributorService.getAuthenticatedCategoriesByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.categories = result['result'];
      })
  }
  getCurrency() {
    var currencyFullName = Constants.currencyFullname;
    var currencySymbols = Constants.currencySymbols;
    this.currencies = Object.keys(currencyFullName).map(name => {
      return {
        name,
        symbol: currencySymbols[name]
      }
    });
  }
  createItemGroup() {
    let formBuilder = new FormBuilder();
    this.itemGroup = formBuilder.group({
      refId: ['', [Validators.required, Validators.maxLength(30)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      currency: ['', [Validators.required]],
      price: [0.00, [Validators.required]],
      quantity: [''],
      categories: [''],
      description: ['', [Validators.maxLength(400)]],
      isEntityNew: [true, [Validators.required]],
      isInStock: [true, [Validators.required]],
      isPriceDisplayed: [false, [Validators.required]],
      isMarkedAsPublished: [false, Validators.required],
      isEcommerce: [false],
      isPickup: [false]
    })
  }
  createEcommerceGroup() {
    let formBuilder = new FormBuilder();
    this.ecommerceGroup = formBuilder.group({
      brand: [''],
      warranty: [''],
      image: [''],
      color: ['Color'],
      hexColor: [''],
      sizes: [''],
      quantity: [''],
      weight: ['']
    })
  }
  setItemSettings() {
    this.itemGroup.get('currency').setValue(this.shop.currency);
  }
  getDefaultSetting() {
    this.authDefaultSettingContributorService.getDefaultItemSettingByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.defaultSetting = <any>result;
        }
        this.setupDefaultSetting();
      })
  }
  setupDefaultSetting() {

    this.itemGroup.patchValue({
      ...this.defaultSetting,
      currency: this.defaultSetting.currency || this.shop.currency
    })
  }
  validateBasicForm() {
    let refId = this.itemGroup.get('refId');
    let name = this.itemGroup.get('name');
    let price = this.itemGroup.get('price');
    let description = this.itemGroup.get('description');

    if (refId.errors && refId.errors.required) {
      WsToastService.toastSubject.next({ content: 'ID is required!', type: 'danger' });
      return false;
    }
    else if (refId.errors && refId.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'ID is too long. Max 30 characters!', type: 'danger' });
      return false;
    }
    else if (name.errors && name.errors.required) {
      WsToastService.toastSubject.next({ content: 'Name is required!', type: 'danger' });
      return false;
    } else if (name.errors && name.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Name is too long. Max 50 characters!', type: 'danger' });
      return false;
    }
    else if (price.errors && price.errors.required) {
      WsToastService.toastSubject.next({ content: 'Price is required!', type: 'danger' });
      return false;
    }
    else if (description.errors && description.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Description is too long. Max 500 characters!', type: 'danger' });
      return false;
    }
    return true;
  }
  setupItemForm(item) {
    this.itemGroup.patchValue(item)
    this.item_id = item['_id'];
    this.itemTypes = item['types'];
    this.profileImageIndex = item['profile_image_index'];
    this.allProfileItems = item.profile_images.map(image => { return { filename: image.url, type: 'url' } });
    this.allDescriptionItems = item.description_images.map(image => { return { filename: image.url, type: 'url' } });
    this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].filename : '';
  }
  addItem() {
    let currentItem = {
      ...this.itemGroup.value,
      profile_image_index: this.profileImageIndex
    }
    return this.authItemContributorService.addItem(currentItem);
  }
  editItem() {
    let currentItem = {
      ...this.currentItem,
      ...this.itemGroup.value,
      types: this.itemTypes,
      profile_image_index: this.profileImageIndex
    };
    return this.authItemContributorService.editItem(currentItem);
  }
  updateItemType() {
    let currentItem = {
      item_id: this.currentItem._id,
      ...this.ecommerceGroup.value,
      types: this.itemTypes,
    };
    this.authItemContributorService.editItemTypes(currentItem)
      .pipe(takeUntil(this.ngUnsubscribe),
        finalize(() => { this.loading.stop() }))
      .subscribe(result => {
        this.refreshCategories();
        this.sharedCategoryService.categoriesRefresh.next(true);
        this.router.navigate([{ outlets: { modal: null } }]);
      });
  }
  uploadAndAddItem() {
    if (this.validateBasicForm()) {
      this.addItem().pipe(
        takeUntil(this.ngUnsubscribe),
        mergeMap((result) => {
          this.item_id = result['_id'];
          this.tempItem = result;
          return this.allProfileItems.length ? this.uploadProfileImages(this.allProfileItems) : of(0);
        }),
        mergeMap(result => {
          return this.allDescriptionItems.length ? this.uploadDescriptionImages(this.allDescriptionItems) : of(0);
        }),
        finalize(() => { this.loading.stop() })
      ).subscribe(result => {
        this.router.navigate([{ outlets: { modal: 'item' } }], { queryParams: { id: this.item_id } });
        this.currentItem = this.tempItem;
        this.isSetEcommerce = true;
        this.refreshCategories();
        this.sharedCategoryService.categoriesRefresh.next(true);
      })
    }
  }
  uploadAndEditItem() {
    if (this.validateBasicForm()) {
      this.loading.start();
      this.editItem().pipe(
        takeUntil(this.ngUnsubscribe),
        mergeMap((result) => {
          let profileItems = this.allProfileItems.filter(x => x.type == 'blob');
          return profileItems.length ? this.uploadProfileImages(profileItems) : of(0);
        }),
        mergeMap(result => {
          let descriptionItems = this.allDescriptionItems.filter(x => x.type == 'blob');
          return descriptionItems.length ? this.uploadDescriptionImages(descriptionItems) : of(0);
        }),
        finalize(() => { this.loading.stop() })
      ).subscribe(result => {
        this.isSetEcommerce = true;
        this.refreshCategories();
        this.sharedCategoryService.categoriesRefresh.next(true);
      })
    }
  }
  resetForm() {
    this.itemGroup.patchValue({
      refId: '',
      name: '',
      currency: this.shop.currency,
      price: '0.00',
      quantity: 0,
      isEntityNew: true,
      isInStock: true,
      isPriceDisplayed: true,
      isMarkedAsPublished: false,
      isEcommerce: false,
      isPickup: false,
      description: ''
    })

    this.profileImageName = '';
    this.allProfileItems = [];
    this.allDescriptionItems = [];
    this.loading.stop();
  }
  fileProfileChangeEvent(event) {
    var preProfileFiles = <Array<File>>event.target.files;
    let uploadedProfileFiles = UploadHelper.getMaxAbleUploadProfileFiles(this.allProfileItems.length, preProfileFiles, 5);
    UploadHelper.notificationIfOver(uploadedProfileFiles, preProfileFiles);
    UploadHelper.showImages([], uploadedProfileFiles, (images) => { return callback.bind(this)(images) });
    this.itemProfileUpload.nativeElement.value = '';

    function callback(image) {
      let uniqueNo = this.ID();
      if (this.profileImageName == '') {
        this.profileImageName = uniqueNo + image['name'];
        this.profileImageIndex = 0;
      }
      this.allProfileItems.push({ url: image['base64'], filename: uniqueNo + image['name'], loading: false, done: false, type: 'blob', id: uniqueNo });
      this.ref.detectChanges();
    }
  }
  fileDescriptionChangeEvent(event) {
    var preProfileFiles = <Array<File>>event.target.files;
    let uploadedDescriptionFiles = UploadHelper.getMaxAbleUploadProfileFiles(this.allDescriptionItems.length, preProfileFiles, 10);
    UploadHelper.notificationIfOver(uploadedDescriptionFiles, preProfileFiles);
    UploadHelper.showImages([], <Array<File>>event.target.files, (images) => callback.bind(this)(images));
    this.itemDescriptionUpload.nativeElement.value = '';

    function callback(image) {
      let uniqueNo = this.ID();
      this.allDescriptionItems.push({ url: image['base64'], filename: image['name'], loading: false, done: false, type: 'blob', id: uniqueNo });
      this.ref.detectChanges();
    }
  }
  uploadProfileImages(uploadProfileItems) {
    uploadProfileItems.forEach(image => { image.loading = true; })
    return from(uploadProfileItems)
      .pipe(mergeMap(image => {
        let obj = {
          id: image['id'],
          file: image['url'],
          profile_image_index: this.profileImageIndex,
          item_id: this.item_id
        };
        return this.authItemContributorService.editProfileImage(obj);
      }), map(result => {
        this.doneUpload(uploadProfileItems, result['id'], result['filename'])
      }));
  }
  uploadDescriptionImages(uploadDescriptionItems) {
    uploadDescriptionItems.forEach(image => { image.loading = true; });
    return from(uploadDescriptionItems)
      .pipe(mergeMap(image => {
        let obj = {
          id: image['id'],
          file: image['url'],
          item_id: this.item_id
        };
        return this.authItemContributorService.editDescriptionImage(obj)
      }),
        map(result => {
          this.doneUpload(uploadDescriptionItems, result['id'], result['filename'])
        }));
  }
  removeProfileImage(filename) {
    var file = ImageHelper.getUploadProfileItem(this.allProfileItems, filename);
    if (file && file.type == 'blob') {
      _.remove(this.allProfileItems, (x) => x == file);
      var image = ImageHelper.getFormattedImage(filename);
      this.profileImageIndex = ImageHelper.getRemoveProfileImageIndex(this.profileImageIndex);
      this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].filename : '';
      var profileImage = ImageHelper.getProfileImageIfEmpty(this.allProfileItems, this.profileImageIndex);
    }
    else {
      let result = confirm('Are you sure to remove?');
      if (result) {
        let obj = {
          item_id: this.currentItem._id,
          filename: file.filename
        }
        this.authItemContributorService.removeProfileImage(obj).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(result => {
            this.allProfileItems = this.allProfileItems.filter(x => x.filename != filename);
            this.profileImageIndex = ImageHelper.getRemoveProfileImageIndex(this.profileImageIndex);
            this.profileImageName = this.allProfileItems.length ? this.allProfileItems[this.profileImageIndex].filename : '';
          });
      }
    }
  }
  removeDescriptionImage(filename) {
    var file = ImageHelper.getUploadProfileItem(this.allDescriptionItems, filename);
    if (file && file.type == 'blob') {
      _.remove(this.allDescriptionItems, (x) => x == filename);
      _.remove(this.allDescriptionItems, (x) => x == file);
      file['done'] = false;
      var image = ImageHelper.getFormattedImage('item_thumbnails');
    }
    else {
      let result = confirm('Are you sure to remove?');
      if (result) {
        let obj = {
          item_id: this.currentItem._id,
          filename: file.filename
        }

        this.authItemContributorService.removeDescriptionImage(obj).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(result => {
            this.allDescriptionItems = this.allDescriptionItems.filter(x => x.filename != filename);
          });
      }
    }
  }
  refreshCategories() {
    this.sharedCategoryService.refreshCategories();
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
    this.profileImageIndex = this.allProfileItems.findIndex(x => x.filename == this.profileImageName);
  }
  ID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  addItemType() {
    let type = {
      quantity: this.ecommerceGroup.value.quantity || 999,
      sizes: this.ecommerceGroup.value.sizes || 'All Sizes',
      hexColor: this.ecommerceGroup.value.hexColor,
      color: this.ecommerceGroup.value.color,
      weight: this.ecommerceGroup.value.weight || 0.5
    }
    this.itemTypes.push({ ...type });
  }
  editItemType() {
    this.itemTypes[this.selectedTypeIndex] = {
      quantity: this.ecommerceGroup.value.quantity || 999,
      sizes: this.ecommerceGroup.value.sizes || 'All Sizes',
      hexColor: this.ecommerceGroup.value.hexColor,
      color: this.ecommerceGroup.value.color,
      weight: this.ecommerceGroup.value.weight || 0.5
    }

    this.resetTypeForm();
  }
  selectType(index) {
    if (this.selectedTypeIndex == index) {
      this.resetTypeForm();
      return;
    }
    this.selectedTypeIndex = index;
    let type = this.itemTypes[index];
    this.ecommerceGroup.patchValue({ ...type });
  }
  resetTypeForm() {
    this.selectedTypeIndex = null;
    this.ecommerceGroup.patchValue({
      color: 'Color',
      quantity: '',
      hexColor: '',
      weight: '',
      sizes: []
    })
  }
  removeItemType(type) {
    _.remove(this.itemTypes, (x) => x == type);
  }
  doneAllUploaded() {
    return this.allProfileItems.filter(x => !x.done && x.type == 'blob').length === 0 && this.allDescriptionItems.filter(x => !x.done && x.type == 'blob').length === 0;
  }
  dropProfile(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allProfileItems, event.previousIndex, event.currentIndex);
  }
  dropDescription(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allDescriptionItems, event.previousIndex, event.currentIndex);
  }
}
