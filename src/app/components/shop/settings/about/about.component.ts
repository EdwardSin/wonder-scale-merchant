import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitAnimation } from '@animations/unit.animation';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { environment } from '@environments/environment.prod';
import { Contributor } from '@objects/contributor';
import { ContributorController } from '@objects/contributor.controller';
import { Tag } from '@objects/tag';
import { TagController } from '@objects/tag.controller';
import { AuthDefaultSettingAdminService } from '@services/http/auth-shop/admin/auth-default-setting-admin.service';
import { AuthShopAdminService } from '@services/http/auth-shop/admin/auth-shop-admin.service';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { ShopAuthorizationService } from '@services/http/general/shop-authorization.service';
import { UserService } from '@services/http/general/user.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';
import { Address } from '@objects/address';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { forkJoin as observableForkJoin, Subject, interval } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { Shop } from '@objects/shop';
import { WsToastComponent } from '@elements/ws-toast/ws-toast.component';
import { EmailValidator } from '@validations/email.validator';
import { URLValidator } from '@validations/urlvalidator';
import { CurrencyService } from '@services/http/general/currency.service';
import * as moment from 'moment';
declare var jQuery: any;
import * as $ from 'jquery';
import { Role } from '@enum/Role.enum';
import { DomSanitizer } from '@angular/platform-browser';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [UnitAnimation.expandDown()]
})
export class AboutComponent implements OnInit {
  isGeneralExpanded: boolean;
  isDefaultExpanded: boolean;
  isContactExpanded: boolean;
  isPermissionExpanded: boolean;
  isContributorExpanded: boolean;
  isAdvancedExpanded: boolean;
  moment = moment;
  isShopClosing: boolean;
  isShopClosable: boolean;
  element: string;
  loading: WsLoading = new WsLoading;
  isPublishLoading: WsLoading = new WsLoading;
  isUnpublishLoading: WsLoading = new WsLoading;
  refreshLoading: WsLoading = new WsLoading;
  address: Address = new Address;
  timetable: Timetable = new Timetable;
  mapController: MapController;
  restaurantTags = TagController.headerTags.restaurantTags;
  serviceTags = TagController.headerTags.serviceTags;
  shoppingTags = TagController.headerTags.shoppingTags;
  shop: Shop;
  form;
  settingsForm;
  settings = {
    isMarkedAsNew: true,
    isInStock: true,
    isPriceDisplayed: true,
    isPublished: true,
    isEcommerce: false,
    isPickup: false,
    defaultCurrency: 'MYR'
  };
  tag = new Tag;
  timeDifference: number;
  timeDifferenceString: string;
  @ViewChildren('websiteElement') websiteElements: QueryList<any>;
  @ViewChildren('telElement') telElements: QueryList<any>;
  @ViewChildren('emailElement') emailElements: QueryList<any>;
  isAdminAuthorized: Boolean;
  valueChanged = _.debounce((value) => this.searchContributors(value), 300);
  userSuggestions = [];
  isProfileImageUploading: WsLoading = new WsLoading();
  isBannerImageUploading: WsLoading = new WsLoading();
  profileImage = 'assets/images/png/shop.png';
  bannerImage;
  bannerImageFile;
  previewImage;
  croppieObj;
  isConfirmUnpublishedModalOpened: boolean;
  isConfirmPublishedModalOpened: boolean;
  isConfirmCloseShopModalOpened: boolean;
  isConfirmReactivateModalOpened: boolean;
  isConfirmQuitShopModalOpened: boolean;
  isEditContributorModalOpened: boolean;
  isProfileUploaderOpened: boolean;
  isBannerUploaderOpened: boolean;
  environment = environment;
  isMobileSize: boolean;
  contributorController: ContributorController = new ContributorController;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private authShopContributorService: AuthShopContributorService,
    private authShopAdminService: AuthShopAdminService,
    private authDefaultSettingAdminService: AuthDefaultSettingAdminService,
    private gpsService: WsGpsService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitization: DomSanitizer,
    public currencyService: CurrencyService,
    private sharedUserService: SharedUserService,
    private authShopUserService: AuthShopUserService,
    private shopAuthorizationService: ShopAuthorizationService,
    private screenService: ScreenService,
    private ref: ChangeDetectorRef) {
    this.mapController = new MapController(this.gpsService, this.address);
  }
  ngOnInit() {
    this.createShopForm();
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.shop = result['shop'];
      if (this.shop.profileImage) {
        this.profileImage = environment.IMAGE_URL + this.shop.profileImage;
      }
      if (this.shop.bannerImage) {
        this.bannerImage = environment.IMAGE_URL + this.shop.bannerImage;
      }
      if (this.shop.status.status == 'closed' && this.shop.status.expiryDate) {
        this.timeDifference = moment(this.shop.status.expiryDate).diff(moment());
        this.timeDifferenceString = moment(this.shop.status.expiryDate).fromNow();
        interval(2000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.timeDifference = moment(this.shop.status.expiryDate).diff(moment());
          this.timeDifferenceString = moment(this.shop.status.expiryDate).fromNow();
        });
      }
      this.ref.detectChanges();
      this.setupShopForm();
      this.getDefaultSetting();
      this.updateContributorAuthorization();
    })
    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
      })

    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('About - Settings - ' + shop_name);

    this.sharedShopService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.contributorController = result;
          this.updateContributorAuthorization();
        }
      })
    
      this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isMobileSize = result;
      })
  }
  updateContributorAuthorization() {
    let contributors = this.contributorController.existsContributors;
    let user = this.sharedUserService.user.value;
    let contributor = contributors.find(contributor => contributor['user'] == user._id && contributor.role == Role.Admin);
    this.shopAuthorizationService.isAdminAuthorized.next(contributor != null);
  }
  getDefaultSetting() {
    this.authDefaultSettingAdminService.getDefaultSettingByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.settings = <any>result['item'];
        }
        this.setupDefaultSettingForm();
      })
  }
  editGeneral() {
    let obj = {
      username: this.form.value.username,
      description: this.form.value.description,
      currency: this.form.value.currency,
      // tags: this.tag.tags
    }
    if (this.isGeneralValidated(this.form)) {
      this.authShopContributorService.editGeneral(obj).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Information has been updated!", type: 'success' });
          this.shop['username'] = this.form.value.username;
          this.shop['description'] = this.form.value.description;
          this.shop['currency'] = this.form.value.currency;
          // this.shop['tags'] = this.tag.tags;
          this.isGeneralExpanded = false;
          this.currencyService.selectedCurrency.next(this.shop.currency);
          this.sharedShopService.shop.next(this.shop);
          this.router.navigate(['shops', this.form.value.username, 'settings', 'about']);
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  editDefault() {
    let settings = {
      ...this.settingsForm.value
    };
    this.authDefaultSettingAdminService.setDefaultSettingByShopId(settings).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isDefaultExpanded = false;
        WsToastService.toastSubject.next({ content: 'Default setting is updated!', type: 'success' });
      })
  }
  editContact() {
    let obj = {
      email: this.shop.email,
      phone: this.shop.phone,
      website: this.shop.website,
      showAddress: this.shop.showAddress,
      fullAddress: this.mapController.address,
      openingInfoType: this.timetable.operatingHourRadio,
      openingInfo: this.timetable.operatingHourRadio == 'selected_hours' ? this.timetable.operatingHours : [],
      longitude: this.mapController.markerPoint.longitude,
      latitude: this.mapController.markerPoint.latitude
    }
    if (this.isContactValidated(obj)) {
      this.authShopContributorService.editContact(obj).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Contact has been updated!", type: 'success' });
          this.isContactExpanded = false;
          this.shop.email = obj.email;
          this.shop.phone = obj.phone;
          this.shop.website = obj.website;
          this.shop.fullAddress = {
            address: obj.fullAddress.address,
            postcode: obj.fullAddress.postcode,
            state: obj.fullAddress.state,
            country: obj.fullAddress.country
          }
          this.shop.location.coordinates = [obj.longitude, obj.latitude];
          this.shop.openingInfo = obj.openingInfo;
          this.shop.openingInfoType = obj.openingInfoType;
          this.sharedShopService.shop.next(this.shop)
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        })
    }
  }
  isGeneralValidated(form) {
    let username = form.get('username');
    let description = form.get('description');
    let currency = form.get('currency');
    if (username.errors && username.errors.required) {
      WsToastService.toastSubject.next({ content: 'Username is required!', type: 'danger' });
      return false;
    }
    else if (description.errors && description.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Description is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    else if (currency.errors && currency.errors.required) {
      WsToastService.toastSubject.next({ content: 'Currency is required!', type: 'danger' });
      return false;
    }
    return true;
  }
  isContactValidated(obj) {
    let emails = obj.email;
    let phones = obj.phone;
    let websites = obj.website;
    let fullAddress = obj.fullAddress;
    if (emails.find(email => !EmailValidator.validate(email))) {
      WsToastService.toastSubject.next({ content: 'Email is not valid!', type: 'danger' });
      return false;
    } else if (phones.find(phone => { return phone.length > 20 })) {
      WsToastService.toastSubject.next({ content: 'Phone is too long! Max 20 characters!', type: 'danger' });
      return false;
    } else if (websites.find(website => { return !URLValidator.validate(website) })) {
      WsToastService.toastSubject.next({ content: 'Website is not valid!', type: 'danger' });
      return false;
    } else if ((this.shop.showAddress && fullAddress && !fullAddress.address) ||
      (this.shop.showAddress && fullAddress && !fullAddress.state) ||
      (this.shop.showAddress && fullAddress && !fullAddress.postcode)) {
      WsToastService.toastSubject.next({ content: 'Please complete your business address!', type: 'danger' });
      return false;
    }
    return true;
  }
  removeBannerImage() {
    if (this.shop.bannerImage) {
      if (confirm('Are you sure to remove banner?')) {
        this.isBannerImageUploading.start();
        this.authShopContributorService.removeBannerImage({
          file: this.shop.bannerImage
        }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isBannerImageUploading.stop() }))
          .subscribe(result => {
            this.bannerImage = '';
            this.shop.bannerImage = '';
            this.sharedShopService.shop.next(this.shop);
            WsToastService.toastSubject.next({ content: 'Banner is removed!', type: 'success' });
          })
      }
    }
    else if (this.shop.bannerImage) {
      this.bannerImage = environment.IMAGE_URL + this.shop.bannerImage;
    }
    else {
      this.bannerImage = '';
    }
  }
  createShopForm() {
    this.form = WSFormBuilder.createShopForm();
    this.settingsForm = WSFormBuilder.createSettingForm();
  }
  setupShopForm() {
    if (this.shop) {
      this.form.controls['name'].setValue(this.shop['name']);
      this.form.controls['name'].disable();
      this.form.controls['username'].setValue(this.shop['username']);
      this.form.controls['description'].setValue(this.shop['description']);
      this.form.controls['currency'].setValue(this.shop['currency']);

      this.shop['phone'] = this.shop['phone'].length ? this.shop['phone'] : [''];
      this.shop['website'] = this.shop['website'].length ? this.shop['website'] : [''];
      this.shop['email'] = this.shop['email'].length ? this.shop['email'] : [''];
      this.form.controls['tel'].setValue(this.shop['phone']);
      this.form.controls['website'].setValue(this.shop['website']);
      this.form.controls['email'].setValue(this.shop['email']);

      if (this.shop && this.shop.fullAddress) {
        this.address.address = this.shop.fullAddress.address;
        this.address.postcode = this.shop.fullAddress.postcode;
        this.address.state = this.shop.fullAddress.state;
        this.address.country = this.shop.fullAddress.country;
        this.mapController.markerPoint.longitude = this.shop.location.coordinates[0];
        this.mapController.markerPoint.latitude = this.shop.location.coordinates[1];
        this.mapController.mapPoint.longitude = this.shop.location.coordinates[0];
        this.mapController.mapPoint.latitude = this.shop.location.coordinates[1];
      }
      if (this.shop.openingInfo && this.shop.openingInfo.length > 0) {
        this.timetable.operatingHours = JSON.parse(JSON.stringify(this.shop.openingInfo));
      } else {
        this.timetable.operatingHours = Timetable.DEFAULT_OPENING_INFO;
      }
      this.shop.openingInfo = this.shop.openingInfo || Timetable.DEFAULT_OPENING_INFO;
      this.timetable.operatingHourRadio = this.shop.openingInfoType;
      this.tag.tags = _.clone(this.shop.tags);
    }
  }
  setupDefaultSettingForm() {
    this.settingsForm.patchValue({
      ...this.settings
    })
  }
  searchContributors(value) {
    if (value != '') {
      this.authShopAdminService.searchContributors(value).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.userSuggestions = result['result'];
      })
    }
    else {
      this.userSuggestions = [];
    }
  }
  getContributors() {
    this.refreshLoading.start();
    this.authShopContributorService.getContributors().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refreshLoading.stop()))
      .subscribe(result => {
        this.contributorController.existsContributors = result['result'];
        this.sharedShopService.contributorRefresh.next(this.contributorController);
        this.updateContributorAuthorization();
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  inviteContributor() {
    if (this.contributorController.newContributors.length) {
      observableForkJoin(this.contributorController.newContributors.map(contributor => {
        let obj = {
          contributor: contributor
        }
        return this.authShopAdminService.inviteContributor(obj);
      }))
        .subscribe(result => {
          this.contributorController.existsContributors = _.union(this.contributorController.existsContributors, this.contributorController.newContributors);
          this.contributorController.newContributors = new Array;
          WsToastService.toastSubject.next({ content: "Contributors are invited!", type: 'success' });
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
    else {
      WsToastService.toastSubject.next({ content: "Please add member to invite!", type: 'danger' });
    }
  }
  addContributor(user) {
    this.userSuggestions = [];
    this.contributorController.searchText = '';
    if (_.find(this.contributorController.existsContributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User is already a contributor!", type: 'danger' });
    }
    else if (_.find(this.contributorController.newContributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User has been added!", type: 'danger' });
    }
    else {
      this.contributorController.newContributors.push(<Contributor>{
        email: user.email,
        user: user._id,
        role: this.contributorController.newRole,
        profileImage: user.profileImage,
        status: 'pending',
        invitedDate: new Date(),
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }
  removeContributor(user) {
    _.remove(this.contributorController.newContributors, (x) => x._id == user._id);
  }
  closePermanently() {
    this.authShopAdminService
      .closePermanently()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        let date = new Date;
        date.setHours(date.getHours() + 1);
        this.shop.status.status = 'closed';
        this.shop.status.expiryDate = date;
        this.sharedShopService.shop.next(this.shop);
        this.isConfirmCloseShopModalOpened = false;
        this.router.navigate(['../../catalogue', 'all'], { relativeTo: this.route });
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  reactivateFromInactive() {
    this.authShopAdminService
      .reactivateShop()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.shop.status.status = 'active';
        this.shop.status.expiryDate = null;
        this.sharedShopService.shop.next(this.shop);
        this.isConfirmReactivateModalOpened = false;
        this.router.navigate(['../../catalogue', 'all'], { relativeTo: this.route });
      });
  }
  quitShop() {
    this.authShopContributorService.leaveShop()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isConfirmQuitShopModalOpened = false;
        this.router.navigate(['shops/all']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  publishPage() {
    this.isPublishLoading.start();
    this.authShopAdminService.publishPage()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isPublishLoading.stop())).subscribe(result => {
      this.shop.isPublished = true;
      this.sharedShopService.shop.next(this.shop);
      this.isConfirmPublishedModalOpened = false;
      WsToastService.toastSubject.next({content: result['message'], type: 'success'});
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  unpublishPage() {
    this.isUnpublishLoading.start();
    this.authShopAdminService.unpublishPage()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isUnpublishLoading.stop()))
    .subscribe(result => {
      this.shop.isPublished = false;
      this.sharedShopService.shop.next(this.shop);
      this.isConfirmUnpublishedModalOpened = false;
      WsToastService.toastSubject.next({ content: result['message'], type: 'success' });
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  openEditContributorModal(contributor) {
    this.isEditContributorModalOpened = true;
    this.contributorController.selectedContributor = contributor;
    this.contributorController.newRole = contributor.role;
  }
  disabledControls() {
    this.shop.showAddress = !this.shop.showAddress;
  }
  removeProfileImage() {
    if (confirm('Are you sure to remove your profile image?')) {
      this.authShopContributorService.removeProfileImage().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
        this.profileImage = 'assets/images/png/shop.png';
      });
    }
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
    let files = <Array<File>>event.target.files;
    for (let file of files) {
      this.previewImageFunc(file, (result) => {
        result.url = this.sanitization.bypassSecurityTrustResourceUrl(result.url);
        this.previewImage = result.url;
        this.uploadBannerImageModalChange();
      });
    }
    event.target.value = "";
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
  async uploadImage() {
    let result = await this.croppieObj.result({size: 'original'});
    this.isProfileImageUploading.start();

    this.authShopContributorService.editProfileImage({ file: result }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isProfileImageUploading.stop() }))
      .subscribe(result => {
        this.profileImage = environment.IMAGE_URL + result['data'];
        this.isProfileUploaderOpened = false;
        this.removePreviewImage();
        WsToastService.toastSubject.next({ content: 'Profile image is changed successfully!', type: 'success' });
      });
  }
  async uploadBannerImage() {
    let result = await this.croppieObj.result({size: 'original'});
    this.isBannerImageUploading.start();

    this.authShopContributorService.editBannerImage({ file: result }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isBannerImageUploading.stop() }))
      .subscribe(result => {
        this.bannerImage = environment.IMAGE_URL + result['data'];
        this.shop.bannerImage = result['data'];
        this.sharedShopService.shop.next(this.shop);
        this.isBannerUploaderOpened = false;
        this.removePreviewImage();
        WsToastService.toastSubject.next({ content: 'Banner image is changed successfully!', type: 'success' });
      });
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
  uploadBannerImageModalChange() {
    $(() => {
      let Croppie = window['Croppie'];
      this.croppieObj = new Croppie(document.getElementById('id-banner-preview-image'), {
        viewport: {
          width: 300,
          height: 108.303,
          type: 'rectangle'
        }
      });
    });
  }
}