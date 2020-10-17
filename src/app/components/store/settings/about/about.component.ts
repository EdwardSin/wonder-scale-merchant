import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitAnimation } from '@animations/unit.animation';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { environment } from '@environments/environment.prod';
import { Contributor } from '@objects/contributor';
import { ContributorController } from '@objects/contributor.controller';
import { Tag } from '@objects/tag';
import { TagController } from '@objects/tag.controller';
import { AuthDefaultSettingAdminService } from '@services/http/auth-store/admin/auth-default-setting-admin.service';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Address } from '@objects/address';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { forkJoin as observableForkJoin, Subject, interval } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { Store } from '@objects/store';
import { EmailValidator } from '@validations/email.validator';
import { URLValidator } from '@validations/urlvalidator';
import { CurrencyService } from '@services/http/general/currency.service';
import * as moment from 'moment';
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
  store: Store;
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
  isConfirmCloseStoreModalOpened: boolean;
  isConfirmReactivateModalOpened: boolean;
  isConfirmQuitStoreModalOpened: boolean;
  isEditContributorModalOpened: boolean;
  isProfileUploaderOpened: boolean;
  isBannerUploaderOpened: boolean;
  environment = environment;
  isMobileSize: boolean;
  contributorController: ContributorController = new ContributorController;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    private authStoreContributorService: AuthStoreContributorService,
    private authStoreAdminService: AuthStoreAdminService,
    private authDefaultSettingAdminService: AuthDefaultSettingAdminService,
    private gpsService: WsGpsService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitization: DomSanitizer,
    public currencyService: CurrencyService,
    private sharedUserService: SharedUserService,
    private storeAuthorizationService: StoreAuthorizationService,
    private screenService: ScreenService,
    private ref: ChangeDetectorRef) {
    this.mapController = new MapController(this.gpsService, this.address);
  }
  ngOnInit() {
    this.createStoreForm();
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result['store'];
      if (this.store.profileImage) {
        this.profileImage = environment.IMAGE_URL + this.store.profileImage;
      }
      if (this.store.bannerImage) {
        this.bannerImage = environment.IMAGE_URL + this.store.bannerImage;
      }
      if (this.store.status.status == 'closed' && this.store.status.expiryDate) {
        this.timeDifference = moment(this.store.status.expiryDate).diff(moment());
        this.timeDifferenceString = moment(this.store.status.expiryDate).fromNow();
        interval(2000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          this.timeDifference = moment(this.store.status.expiryDate).diff(moment());
          this.timeDifferenceString = moment(this.store.status.expiryDate).fromNow();
        });
      }
      this.ref.detectChanges();
      this.setupStoreForm();
      this.getDefaultSetting();
      this.updateContributorAuthorization();
    })
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
      })

    let store_name = this.sharedStoreService.store_name;
    DocumentHelper.setWindowTitleWithWonderScale('About - Settings - ' + store_name);

    this.sharedStoreService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
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
    this.storeAuthorizationService.isAdminAuthorized.next(contributor != null);
  }
  getDefaultSetting() {
    this.authDefaultSettingAdminService.getDefaultSettingByStoreId().pipe(takeUntil(this.ngUnsubscribe))
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
      this.authStoreContributorService.editGeneral(obj).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Information has been updated!", type: 'success' });
          this.store['username'] = this.form.value.username;
          this.store['description'] = this.form.value.description;
          this.store['currency'] = this.form.value.currency;
          // this.store['tags'] = this.tag.tags;
          this.isGeneralExpanded = false;
          this.currencyService.selectedCurrency.next(this.store.currency);
          this.sharedStoreService.store.next(this.store);
          this.router.navigate(['stores', this.form.value.username, 'settings', 'about']);
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  editDefault() {
    let settings = {
      ...this.settingsForm.value
    };
    this.authDefaultSettingAdminService.setDefaultSettingByStoreId(settings).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isDefaultExpanded = false;
        WsToastService.toastSubject.next({ content: 'Default setting is updated!', type: 'success' });
      })
  }
  editContact() {
    let obj = {
      email: this.filterEmptyValue(this.store.email),
      phone: this.filterEmptyValue(this.store.phone),
      website: this.filterEmptyValue(this.store.website).length ? this.filterEmptyValue(this.store.website) : [''],
      showAddress: this.store.showAddress,
      fullAddress: this.mapController.address,
      openingInfoType: this.timetable.operatingHourRadio,
      openingInfo: this.timetable.operatingHourRadio == 'selected_hours' ? this.timetable.operatingHours : [],
      longitude: this.mapController.markerPoint.longitude,
      latitude: this.mapController.markerPoint.latitude
    }
    if (this.isContactValidated(obj)) {
      this.authStoreContributorService.editContact(obj).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Contact has been updated!", type: 'success' });
          this.isContactExpanded = false;
          this.store.email = obj.email;
          this.store.phone = obj.phone;
          this.store.website = obj.website;
          this.store.fullAddress = {
            address: obj.fullAddress.address,
            postcode: obj.fullAddress.postcode,
            state: obj.fullAddress.state,
            country: obj.fullAddress.country
          }
          this.store.location.coordinates = [obj.longitude, obj.latitude];
          this.store.openingInfo = obj.openingInfo;
          this.store.openingInfoType = obj.openingInfoType;
          this.sharedStoreService.store.next(this.store)
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
    } else if ((this.store.showAddress && fullAddress && !fullAddress.address) ||
      (this.store.showAddress && fullAddress && !fullAddress.state) ||
      (this.store.showAddress && fullAddress && !fullAddress.postcode)) {
      WsToastService.toastSubject.next({ content: 'Please complete your store address!', type: 'danger' });
      return false;
    }
    return true;
  }
  filterEmptyValue(arr) {
    return _.filter(arr, item => {
        return !_.isEmpty(item);
    });
  }
  removeBannerImage() {
    if (this.store.bannerImage) {
      if (confirm('Are you sure to remove banner?')) {
        this.isBannerImageUploading.start();
        this.authStoreContributorService.removeBannerImage({
          file: this.store.bannerImage
        }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isBannerImageUploading.stop() }))
          .subscribe(result => {
            this.bannerImage = '';
            this.store.bannerImage = '';
            this.sharedStoreService.store.next(this.store);
            WsToastService.toastSubject.next({ content: 'Banner is removed!', type: 'success' });
          })
      }
    }
    else if (this.store.bannerImage) {
      this.bannerImage = environment.IMAGE_URL + this.store.bannerImage;
    }
    else {
      this.bannerImage = '';
    }
  }
  createStoreForm() {
    this.form = WSFormBuilder.createStoreForm();
    this.settingsForm = WSFormBuilder.createSettingForm();
  }
  setupStoreForm() {
    if (this.store) {
      this.form.controls['name'].setValue(this.store['name']);
      this.form.controls['name'].disable();
      this.form.controls['username'].setValue(this.store['username']);
      this.form.controls['description'].setValue(this.store['description']);
      this.form.controls['currency'].setValue(this.store['currency']);

      this.store['phone'] = this.store['phone'].length ? this.store['phone'] : [''];
      this.store['website'] = this.store['website'].length ? this.store['website'] : [''];
      this.store['email'] = this.store['email'].length ? this.store['email'] : [''];
      this.form.controls['tel'].setValue(this.store['phone']);
      this.form.controls['website'].setValue(this.store['website']);
      this.form.controls['email'].setValue(this.store['email']);

      if (this.store && this.store.fullAddress) {
        this.address.address = this.store.fullAddress.address;
        this.address.postcode = this.store.fullAddress.postcode;
        this.address.state = this.store.fullAddress.state;
        this.address.country = this.store.fullAddress.country;
        this.mapController.markerPoint.longitude = this.store.location.coordinates[0];
        this.mapController.markerPoint.latitude = this.store.location.coordinates[1];
        this.mapController.mapPoint.longitude = this.store.location.coordinates[0];
        this.mapController.mapPoint.latitude = this.store.location.coordinates[1];
      }
      if (this.store.openingInfo && this.store.openingInfo.length > 0) {
        this.timetable.operatingHours = JSON.parse(JSON.stringify(this.store.openingInfo));
      } else {
        this.timetable.operatingHours = Timetable.DEFAULT_OPENING_INFO;
      }
      this.store.openingInfo = this.store.openingInfo || Timetable.DEFAULT_OPENING_INFO;
      this.timetable.operatingHourRadio = this.store.openingInfoType;
      this.tag.tags = _.clone(this.store.tags);
    }
  }
  setupDefaultSettingForm() {
    this.settingsForm.patchValue({
      ...this.settings
    })
  }
  searchContributors(value) {
    if (value != '') {
      this.authStoreAdminService.searchContributors(value).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.userSuggestions = result['result'];
      })
    }
    else {
      this.userSuggestions = [];
    }
  }
  getContributors() {
    this.refreshLoading.start();
    this.authStoreContributorService.getContributors().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refreshLoading.stop()))
      .subscribe(result => {
        this.contributorController.existsContributors = result['result'];
        this.sharedStoreService.contributorRefresh.next(this.contributorController);
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
        return this.authStoreAdminService.inviteContributor(obj);
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
    this.authStoreAdminService
      .closePermanently()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        let date = new Date;
        date.setHours(date.getHours() + 1);
        this.store.status.status = 'closed';
        this.store.status.expiryDate = date;
        this.sharedStoreService.store.next(this.store);
        this.isConfirmCloseStoreModalOpened = false;
        this.router.navigate(['/stores/' + this.store.username + '']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  reactivateFromInactive() {
    this.authStoreAdminService
      .reactivateStore()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.store.status.status = 'active';
        this.store.status.expiryDate = null;
        this.sharedStoreService.store.next(this.store);
        this.isConfirmReactivateModalOpened = false;
        this.router.navigate(['/stores/' + this.store.username + '']);
      });
  }
  quitStore() {
    this.authStoreContributorService.leaveStore()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isConfirmQuitStoreModalOpened = false;
        this.router.navigate(['stores/all']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  publishStore() {
    this.isPublishLoading.start();
    this.authStoreAdminService.publishStore()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isPublishLoading.stop())).subscribe(result => {
      this.store.isPublished = true;
      this.sharedStoreService.store.next(this.store);
      this.isConfirmPublishedModalOpened = false;
      WsToastService.toastSubject.next({content: result['message'], type: 'success'});
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  unpublishStore() {
    this.isUnpublishLoading.start();
    this.authStoreAdminService.unpublishStore()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isUnpublishLoading.stop()))
    .subscribe(result => {
      this.store.isPublished = false;
      this.sharedStoreService.store.next(this.store);
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
    this.store.showAddress = !this.store.showAddress;
  }
  removeProfileImage() {
    if (confirm('Are you sure to remove your profile image?')) {
      this.authStoreContributorService.removeProfileImage().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
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

    this.authStoreContributorService.editProfileImage({ file: result }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isProfileImageUploading.stop() }))
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

    this.authStoreContributorService.editBannerImage({ file: result }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.isBannerImageUploading.stop() }))
      .subscribe(result => {
        this.bannerImage = environment.IMAGE_URL + result['data'];
        this.store.bannerImage = result['data'];
        this.sharedStoreService.store.next(this.store);
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