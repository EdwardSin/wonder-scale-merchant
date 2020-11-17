import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Store } from '@objects/store';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { forkJoin, of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { MapController } from '@objects/map.controller';
import * as _ from 'lodash';
import { Timetable } from '@objects/ws-timetable';
import { Address } from '@objects/address';
import { WsGpsService } from '@services/general/ws-gps.service';
import { TagController } from '@objects/tag.controller';
import { Tag } from '@objects/tag';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '@environments/environment';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { ScreenService } from '@services/general/screen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailValidator } from '@validations/email.validator';
import { URLValidator } from '@validations/url.validator';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.scss']
})
export class StorePageComponent implements OnInit {
  environment = environment;
  store: Store;
  selectedPreview: string = 'website';
  isChanged: boolean = false;
  isMobileSize: boolean = false;
  isSaveStoreLoading: WsLoading = new WsLoading;
  isBannersOpened: boolean = false;
  isProfileImageOpened: boolean = false;
  isMenuImagesOpened: boolean;
  isOpeningHoursOpened: boolean = false;
  isDescriptionOpened: boolean = false;
  isStoreTypeOpened: boolean = false;
  isAddressOpened: boolean = false;
  isTagsOpened: boolean = false;
  isContactButtonOpened: boolean = false;
  isPhoneOpened: boolean = false;
  isEmailOpened: boolean = false;
  isWebsiteOpened: boolean = false;
  isFacebookOpened: boolean = false;
  isInstagramOpened: boolean = false;
  isTwitterOpened: boolean = false;
  isWhatsappOpened: boolean = false;
  isMessengerOpened: boolean = false;
  isYoutubeOpened: boolean = false;
  isSnapchatOpened: boolean = false;
  isTelegramOpened: boolean = false;
  isWechatOpened: boolean = false;
  isAddMediaOpened: boolean = false;
  selectedNav: string = 'info';
  editingStore: Store;
  editingTimetable: Timetable;
  editingMapController: MapController;
  editingBanners: Array<string> = [];
  editingMenuImages: Array<string> = [];
  editingProfileImage: string;
  address: Address = new Address;
  tag = new Tag;
  previewImage;
  allBanners = [];
  allMenuImages = [];
  editingAllBanners = [];
  editingAllMenuImages = [];
  croppieObj;
  isUploadProfileImage: boolean;
  isDeleteProfileImage: boolean;
  removingBanners = [];
  removingMenuImages = [];
  isMediaMax: boolean;
  editingMedias = [];
  selectedMedia: string = '';
  selectedContactButtonLabel: string = '';
  selectedContactButtonType: string = '';
  selectedContactButtonValue: string = '';
  error: string = '';

  restaurantTags = TagController.headerTags.restaurantTags;
  serviceTags = TagController.headerTags.serviceTags;
  shoppingTags = TagController.headerTags.shoppingTags;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private gpsService: WsGpsService,
    private screenService: ScreenService,
    private sharedStoreService: SharedStoreService,
    private authStoreContributorService: AuthStoreContributorService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.selectedNav = this.route.snapshot.queryParams.nav || 'info';
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      DocumentHelper.setWindowTitleWithWonderScale('Store Page - ' + this.store.name);
      this.editingStore = _.cloneDeep(result);
      this.allBanners = this.store.informationImages.map(image => { return { url: image, type: 'url' } });
      this.editingAllBanners = _.cloneDeep(this.allBanners);
      this.editingBanners = this.store.informationImages.map(image => environment.IMAGE_URL + image);
      this.editingProfileImage = this.store.profileImage ? environment.IMAGE_URL + this.store.profileImage: null;
      this.allMenuImages = this.store.menuImages.map(image => { return {url: image, type: 'url'}});
      this.editingAllMenuImages = _.cloneDeep(this.allMenuImages);
      this.editingMenuImages = this.store.menuImages.map(image => environment.IMAGE_URL + image);
    });
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      if(queryParams['nav']) {
        this.selectedNav = queryParams['nav'];
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  onEditBannersClicked() {
    this.isBannersOpened = true;
    this.editingAllBanners = _.cloneDeep(this.allBanners);
  }
  onEditProfileImageClicked() {
    this.isProfileImageOpened = true;
    this.previewImage = null;
  }
  onEditQuickMenuClicked() {
    this.isMenuImagesOpened = true;
    this.editingAllMenuImages = _.cloneDeep(this.allMenuImages);
  }
  onEditOpeningHoursClicked() {
    this.isOpeningHoursOpened = true;
    this.editingTimetable = new Timetable;
    this.editingTimetable.operatingHourRadio = this.editingStore.openingInfoType;
    this.editingTimetable.operatingHours = this.editingStore.openingInfo.length ? _.cloneDeep(this.editingStore.openingInfo): this.editingTimetable.operatingHours;
  }
  onEditDescriptionClicked() {
    this.isDescriptionOpened = true;
  }
  onEditStoreTypeClicked() {
    this.isStoreTypeOpened = true;
  }
  onEditAddressClicked() {
    this.isAddressOpened = true;
    this.address = new Address();
    this.editingMapController = new MapController(this.gpsService, this.address);
    if (this.editingStore && this.editingStore.fullAddress) {
      this.address.address = this.store.fullAddress.address;
      this.address.postcode = this.store.fullAddress.postcode;
      this.address.state = this.store.fullAddress.state;
      this.address.country = this.store.fullAddress.country;
      this.editingMapController.markerPoint.longitude = this.store.location.coordinates[0];
      this.editingMapController.markerPoint.latitude = this.store.location.coordinates[1];
      this.editingMapController.mapPoint.longitude = this.store.location.coordinates[0];
      this.editingMapController.mapPoint.latitude = this.store.location.coordinates[1];
    }
  }
  onEditTagsClicked() {
    this.isTagsOpened = true;
    this.tag.tags = this.editingStore.tags;
  }
  onEditContactButtonClicked() {
    this.isContactButtonOpened = true;
    if(this.store.contactButton) {
      this.selectedContactButtonLabel = this.store.contactButton.label;
      this.selectedContactButtonType = this.store.contactButton.type;
      this.selectedContactButtonValue = this.store.contactButton.value;
    }
  }
  onEditPhoneClicked() {
    this.isPhoneOpened = true;
  }
  onEditEmailClicked() {
    this.isEmailOpened = true;
  }
  onEditWebsiteClicked() {
    this.isWebsiteOpened = true;
  }
  onEditFacebookClicked() {
    this.isFacebookOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'facebook').map(media => media.value);
  }
  onEditInstagramClicked() {
    this.isInstagramOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'instagram').map(media => media.value);
  }
  onEditTwitterClicked() {
    this.isTwitterOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'twitter').map(media => media.value);
  }
  onEditWhatsappClicked() {
    this.isWhatsappOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'whatsapp').map(media => media.value);
  }
  onEditMessengerClicked() {
    this.isMessengerOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'messenger').map(media => media.value);
  }
  onEditYoutubeClicked() {
    this.isYoutubeOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'youtube').map(media => media.value);
  }
  onEditSnapchatClicked() {
    this.isSnapchatOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'snapchat').map(media => media.value);
  }
  onEditTelegramClicked() {
    this.isTelegramOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'telegram').map(media => media.value);
  }
  onEditWechatClicked() {
    this.isWechatOpened = true;
    this.editingMedias = this.store.media.filter(media => media.type == 'wechat').map(media => media.value);
  }
  onAddMediaClicked() {
    this.isAddMediaOpened = true;
    this.isMediaMax = this.isMediaMaximum();
  }
  onConfirmEditBannersClicked() {
    this.editingBanners = [...this.editingAllBanners.map(banner => {
      if (banner.type == 'url') {
        return environment.IMAGE_URL + banner.url;
      } else if (banner.type == 'blob') {
        return banner.url
      }
    })];
    this.allBanners = _.cloneDeep(this.editingAllBanners);
    this.isChanged = true;
    this.isBannersOpened = false;
  }
  onConfirmEditMenuImagesClicked() {
    this.editingMenuImages = [...this.editingAllMenuImages.map(image => {
      if (image.type == 'url') {
        return environment.IMAGE_URL + image.url;
      } else if (image.type == 'blob') {
        return image.url
      }
    })];
    this.allMenuImages = _.cloneDeep(this.editingAllMenuImages);
    this.isChanged = true;
    this.isMenuImagesOpened = false;
  }
  async onConfirmEditProfileImageClicked() {
    this.editingStore.profileImage = await this.croppieObj.result({size: {width: 300, height: 300}})
    this.editingProfileImage = this.editingStore.profileImage;
    this.isChanged = true;
    this.isProfileImageOpened = false;
    this.isUploadProfileImage = true;
    this.isDeleteProfileImage = false;
  }
  onConfirmEditOpeningHoursClicked() {
    this.store.openingInfoType = this.editingTimetable.operatingHourRadio;
    this.store.openingInfo = this.editingTimetable.operatingHours;
    this.editingStore.openingInfoType = this.editingTimetable.operatingHourRadio;
    this.editingStore.openingInfo = this.editingTimetable.operatingHours;
    this.isChanged = true;
    this.isOpeningHoursOpened = false;
  }
  onConfirmEditDescriptionClicked() {
    this.store.description = this.editingStore.description;
    this.isChanged = true;
    this.isDescriptionOpened = false;
  }
  onConfirmEditStoreTypeClicked() {
    this.isChanged = true;
    this.isStoreTypeOpened = false;
  }
  onConfirmEditAddressClicked() {
    this.editingStore.fullAddress = {
      address: this.address.address,
      state: this.address.state,
      postcode: this.address.postcode,
      country: this.address.country
    };
    this.editingStore.location.coordinates = [this.editingMapController.markerPoint.longitude, this.editingMapController.markerPoint.latitude];
    this.store.fullAddress = this.editingStore.fullAddress;
    this.store.location = this.editingStore.location;
    this.store.showAddress = this.editingStore.showAddress;
    this.isChanged = true;
    this.isAddressOpened = false;
  }
  onConfirmEditTagsClicked() {
    this.editingStore.tags = [...this.tag.tags];
    this.store.tags = [...this.tag.tags];
    this.isChanged = true;
    this.isTagsOpened = false;
  }
  onConfirmEditContactButtonClicked() {
    this.editingStore.contactButton = {
      label: this.selectedContactButtonLabel,
      type: this.selectedContactButtonType,
      value: this.selectedContactButtonValue
    };
    this.store.contactButton = _.cloneDeep(this.editingStore.contactButton);
    this.selectedContactButtonLabel = '';
    this.selectedContactButtonType = '';
    this.selectedContactButtonValue = '';
    this.isChanged = true;
    this.isContactButtonOpened = false;
  }
  onConfirmEditPhoneClicked() {
    this.store.phone = _.compact(this.editingStore.phone);
    this.isChanged = true;
    this.isPhoneOpened = false;
  }
  onConfirmEditEmailClicked() {
    let emails = _.compact(this.editingStore.email);
    if (!emails.filter(email => !EmailValidator.validate(email)).length || !emails.length) {
      this.store.email = _.compact(this.editingStore.email);
      this.isChanged = true;
      this.isEmailOpened = false;
    } else {
      WsToastService.toastSubject.next({ content: 'Please enter valid email!', type: 'danger'});
    }
  }
  onConfirmEditWebsiteClicked() {
    let websites = _.compact(this.editingStore.website);
    if (!websites.filter(url => !URLValidator.validate(url)).length || !websites.length) {
      this.store.website = _.compact(this.editingStore.website);
      this.isChanged = true;
      this.isWebsiteOpened = false;
    } else {
      WsToastService.toastSubject.next({ content: 'Please enter valid website!', type: 'danger'});
    }
  }
  onConfirmEditFacebookClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'facebook');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'facebook', value}: null})]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isFacebookOpened = false;
  }
  onConfirmEditInstagramClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'instagram');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'instagram', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isInstagramOpened = false;
  }
  onConfirmEditTwitterClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'twitter');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'twitter', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isTwitterOpened = false;
  }
  onConfirmEditWhatsappClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'whatsapp');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'whatsapp', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isWhatsappOpened = false;
  }
  onConfirmEditMessengerClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'messenger');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'messenger', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isMessengerOpened = false;
  }
  onConfirmEditYoutubeClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'youtube');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'youtube', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isYoutubeOpened = false;
  }
  onConfirmEditSnapchatClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'snapchat');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'snapchat', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isSnapchatOpened = false;
  }
  onConfirmEditTelegramClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'telegram');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'telegram', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isTelegramOpened = false;
  }
  onConfirmEditWechatClicked() {
    let remainingMedias = _.remove(this.store.media, media => media.type !== 'wechat');
    this.store.media = _.compact([...remainingMedias, ...this.editingMedias.map(value => {return value ? {type: 'wechat', value} : null })]);
    this.store = {...this.store};
    this.isChanged = true;
    this.isWechatOpened = false;
  }
  onConfirmAddMediaClicked(type, value) {
    if (validateMedia.bind(this)(type, value)) {
      this.store.media.push({ type, value });
      this.store = {...this.store};
      this.isChanged = true;
      this.isAddMediaOpened = false;
      this.selectedMedia = '';
      this.error = '';
      this.isMediaMax = this.isMediaMaximum();
      this.ref.detectChanges();
    }
    function validateMedia(type, value) {
      if (!value || (value && value.trim() === '')) {
        this.error = 'Account is required!';
        return false;
      }
      else if (value.length > 30) {
        this.error = 'Account is too long!';
        return false;
      }
      else if (this.store.media.find(media => {return media.type === type && media.value === value})) {
        this.error = 'Account is existing!';
        return false;
      }
      return true;
    }
  }
  onResetProfileImageClicked() {
    this.editingProfileImage = this.store.profileImage ? environment.IMAGE_URL + this.store.profileImage: '';
    this.isChanged = true;
    this.isProfileImageOpened = false;
    this.isUploadProfileImage = false;
    this.isDeleteProfileImage = false;
  }
  onDeleteProfileImageClicked() {
    this.editingStore.profileImage = null;
    this.store.profileImage = null;
    this.editingProfileImage = '';
    this.isChanged = true;
    this.isProfileImageOpened = false;
    this.isUploadProfileImage = false;
    this.isDeleteProfileImage = true;
  }
  onDeleteContactButtonClicked() {
    this.store.contactButton = null;
    this.editingStore.contactButton = null;
    this.selectedContactButtonLabel = '';
    this.selectedContactButtonType = '';
    this.selectedContactButtonValue = '';
    this.isChanged = true;
  }
  onConfirmStoreSaved() {
    let obj = {
      ...this.store
    }
    let isInformationImagesUploaded = this.allBanners.find(banner => banner.type === 'blob');
    let isInformationImagesRemove = this.removingBanners.length > 0;
    let isMenuImagesUploaded = this.allMenuImages.find(image => image.type === 'blob');
    let isMenuImagesRemove = this.removingMenuImages.length > 0;
    let profileImageObservable = this.isUploadProfileImage ? this.authStoreContributorService.editProfileImage({ file: this.editingStore.profileImage }) : of(null);
    let removeProfileImageObservable = this.isDeleteProfileImage ? this.authStoreContributorService.removeProfileImage() : of(null);
    let informationImagesObservable = isInformationImagesUploaded ? this.getInformationImagesObservable() : of([]);
    let removeInformationImagesObservable = isInformationImagesRemove ? this.removeInformationImagesObservable() : of([]);
    let menuImagesObservable = isMenuImagesUploaded ? this.getMenuImagesObservable() : of([]);
    let removeMenuImagesObservable = isMenuImagesRemove ? this.removeMenuImagesObservable() : of([]);
    this.isSaveStoreLoading.start();
    forkJoin([profileImageObservable, removeProfileImageObservable, informationImagesObservable, removeInformationImagesObservable, menuImagesObservable, removeMenuImagesObservable]).pipe(switchMap((result) => {
      let informationImages = <Array<any>>result[2];
      let menuImages = <Array<any>>result[4];
      let editingBanners = this.allBanners.map(banner => banner.url);
      let editingMenuImages = this.allMenuImages.map(image => image.url);
      informationImages.forEach(informationImage => {
        editingBanners[informationImage.index] = informationImage.image;
        this.allBanners[informationImage.index] = { type: 'url', url: informationImage.image };
        this.editingAllBanners[informationImage.index] = { type: 'url', url: informationImage.image };
      });
      menuImages.forEach(menuImage => {
        editingMenuImages[menuImage.index] = menuImage.image;
        this.allMenuImages[menuImage.index] = { type: 'url', url: menuImage.image };
        this.editingAllMenuImages[menuImage.index] = { type: 'url', url: menuImage.image };
      })
      this.removingBanners = [];
      this.removingMenuImages = [];
      this.editingBanners = editingBanners.map(image => environment.IMAGE_URL + image);
      this.editingMenuImages = editingMenuImages.map(image => environment.IMAGE_URL + image);
      obj.informationImages = editingBanners;
      obj.menuImages = editingMenuImages;
      return this.authStoreContributorService.editStore(obj);
    }), takeUntil(this.ngUnsubscribe), finalize(() => this.isSaveStoreLoading.stop())).subscribe(result => {
      this.isChanged = false;
      WsToastService.toastSubject.next({ content:'Store is updated!', type: 'success' });
    });
  }
  navigateToInfo() {
    this.router.navigate([], {queryParams: {nav: 'info'}, queryParamsHandling: 'merge'});
  }
  navigateToMenu() {
    this.router.navigate([], {queryParams: {nav: 'menu'}, queryParamsHandling: 'merge'});
  }
  navigateToShare() {
    this.router.navigate([], {queryParams: {nav: 'share'}, queryParamsHandling: 'merge'});
  }
  removeInformationImagesObservable() {
    return forkJoin(this.removingBanners.map(image => {
      return this.authStoreContributorService.removeInformationImage({ filename: image.url })
    }));
  }
  removeMenuImagesObservable() {
    return forkJoin(this.removingMenuImages.map(image => {
      return this.authStoreContributorService.removeMenuImage({ filename: image.url })
    }));
  }
  getInformationImagesObservable() {
    let images_blob = this.allBanners.filter(image => image.type === 'blob');
    return forkJoin(images_blob.map(image => {
      let obj = {
        file: image.base64,
        index: this.allBanners.indexOf(image)
      };
      return this.authStoreContributorService.editInformationImages(obj);
    }));
  }
  getMenuImagesObservable() {
    let images_blob = this.allMenuImages.filter(image => image.type === 'blob');
    return forkJoin(images_blob.map(image => {
      let obj = {
        file: image.base64,
        index: this.allMenuImages.indexOf(image)
      };
      return this.authStoreContributorService.editMenuImages(obj);
    }));
  }
  fileChangeEvent(event) {
    let files = <Array<File>>event.target.files;
    for (let file of files) {
      this.previewImageFunc(file, (result) => {
        result.url = this.sanitization.bypassSecurityTrustResourceUrl(result.url);
        this.previewImage = result.url;
        this.uploadImageModalChange();
      });
    }
    event.target.value = "";
  }
  fileBannerChangeEvent(event) {
    event.forEach(item => {
      let exist = this.editingAllBanners.find(image => {
        return image.name == item.name && image.file.size == item.file.size;
      })
      if (!exist) {
        this.editingAllBanners.push(item);
      }
    });
  }
  fileMenuImageChangeEvent(event) {
    event.forEach(item => {
      let exist = this.editingAllMenuImages.find(image => {
        return image.name == item.name && image.file.size == item.file.size;
      })
      if (!exist) {
        this.editingAllMenuImages.push(item);
      }
    });
  }
  previewImageFunc(file, callback) {
    let reader = new FileReader;
    reader.onload = function (e) {
      let img = {
        name: file['name'],
        file: file,
        url: URL.createObjectURL(file),
        type: 'blob',
        base64: reader.result
      };
      if (file['name'] && file['name'].split('.').length > 1) {
        img['ext'] = file['name'].split('.').pop();
      }
      callback(img);
    }
    reader.readAsDataURL(file);
  }
  removePreviewImage() {
    this.previewImage = null;
    $('.croppie-container').remove();
  }
  mediaChange() {
    this.error = '';
  }
  uploadImageModalChange() {
    $(() => {
      let Croppie = window['Croppie'];
      this.croppieObj = new Croppie(document.getElementById('id-preview-image'), {
        viewport: {
          width: 138,
          height: 138,
          type: 'square'
        }
      });
    });
  }
  isMediaMaximum() {
    const MAX = 20;
    if (this.store && this.store.media) {
      return this.store.media.length > MAX;
    }
    return false;
  }
  changePreview(platform) {
    this.selectedPreview = platform;
    if (this.selectedPreview == 'mobile') {
      this.router.navigate([], { queryParams: {nav: 'info'}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate([], { queryParams: {nav: 'overview'}, queryParamsHandling: 'merge'});
    }
  }
  removeBanner(item) {
    this.removingBanners = [...this.removingBanners, ..._.filter(this.editingAllBanners, x => x.type == 'url' && x.url == item.url)];
    this.editingAllBanners = _.filter(this.editingAllBanners, (x) => x.url !== item.url);
  }
  dropBanner(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.editingAllBanners, event.previousIndex, event.currentIndex);
  }
  removeMenuImage(item) {
    this.removingMenuImages = [...this.removingMenuImages, ..._.filter(this.editingAllMenuImages, x => x.type == 'url' && x.url == item.url)];
    this.editingAllMenuImages = _.filter(this.editingAllMenuImages, (x) => x.url !== item.url);
  }
  dropMenuImage(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.editingAllMenuImages, event.previousIndex, event.currentIndex);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
