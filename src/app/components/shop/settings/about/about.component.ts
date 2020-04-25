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
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';
import { Address } from '@objects/address';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { forkJoin as observableForkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { Shop } from '@objects/shop';
import { WsToastComponent } from '@components/elements/ws-toast/ws-toast.component';
import{ EmailValidator} from '@validations/email.validator';
import { URLValidator } from '@validations/urlvalidator';
import { CurrencyService } from '@services/http/general/currency.service';

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

  isShopClosing: boolean;
  isShopClosable: boolean;
  isShowLocation: boolean;
  remove_day_number: number;
  element: string;
  loading: WsLoading = new WsLoading;
  refreshLoading: WsLoading = new WsLoading;
  isBannerUploaded: boolean;

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
  @ViewChildren('websiteElement') websiteElements: QueryList<any>;
  @ViewChildren('telElement') telElements: QueryList<any>;
  @ViewChildren('emailElement') emailElements: QueryList<any>;
  isAdminAuthorized: Boolean;
  valueChanged = _.debounce((value) => this.searchContributors(value), 300);
  userSuggestions = [];
  isProfileImageUploading: WsLoading = new WsLoading();
  isBannerImageUploading: WsLoading = new WsLoading();
  profileImage;
  bannerImage;
  bannerImageFile;
  environment = environment;
  contributorController: ContributorController = new ContributorController;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private authShopContributorService: AuthShopContributorService,
    private authShopAdminService: AuthShopAdminService,
    private authDefaultSettingAdminService: AuthDefaultSettingAdminService,
    private modalService: WsModalService,
    private userService: UserService,
    private gpsService: WsGpsService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService,
    private authShopUserService: AuthShopUserService,
    private shopAuthorizationService: ShopAuthorizationService,
    private ref: ChangeDetectorRef) {
    this.mapController = new MapController(this.gpsService, this.address);
  }

  ngOnInit() {
    this.createShopForm();
    this.route.data.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.shop = result['shop'];
        if(this.shop.profileImage){
          this.profileImage = environment.IMAGE_URL + this.shop.profileImage;
        }
        if(this.shop.bannerImage){
          this.bannerImage = environment.IMAGE_URL + this.shop.bannerImage;
        }
        this.ref.detectChanges();
        this.getDateDifference();
        this.setupShopForm();
        this.getDefaultSetting();
      })

    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('About - Settings | ' + shop_name);

    this.sharedShopService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.contributorController = result;
        }
      })

    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
      })
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
      fullAddress: this.mapController.address,
      openingInfoType: this.timetable.operatingHourRadio,
      openingInfo: this.timetable.operatingHourRadio == 'selected_hours' ? this.timetable.operatingHours : [],
      longitude: this.mapController.markerLng,
      latitude: this.mapController.markerLat
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
      WsToastService.toastSubject.next({ content: 'Username is required!', type: 'danger'});
      return false;
    }
    else if (description.errors && description.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Description is too long. Max 256 characters!', type: 'danger' });
      return false;
    }
    else if (currency.errors && currency.errors.required) {
      WsToastService.toastSubject.next({ content: 'Currency is required!', type: 'danger'});
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
    } else if (phones.find(phone => {return phone.length > 20})) {
      WsToastService.toastSubject.next({ content: 'Phone is too long! Max 20 characters!', type: 'danger' });
      return false;
    } else if (websites.find(website => {return !URLValidator.validate(website)})) {
      WsToastService.toastSubject.next({ content: 'Website is not valid!', type: 'danger' });
      return false;
    } else if ((this.isShowLocation && fullAddress && !fullAddress.address) || 
                (this.isShowLocation && fullAddress && !fullAddress.state) ||
                (this.isShowLocation && fullAddress && !fullAddress.postcode)) {
      WsToastService.toastSubject.next({ content: 'Address should be completed!', type: 'danger' });
      return false;
    }
    return true;
  }
  editBannerImage() {
    if (this.isBannerUploaded) {
      this.isBannerImageUploading.start();
      this.authShopContributorService.editBannerImage({ file: this.bannerImageFile.base64, removeFile: this.shop.bannerImage})
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.isBannerImageUploading.stop()}))
      .subscribe(result => {
        this.bannerImage = environment.IMAGE_URL + result['data'];
        this.isBannerUploaded = false;
        this.shop.bannerImage = result['data'];
        this.sharedShopService.shop.next(this.shop);
        WsToastService.toastSubject.next({ content: 'Banner image is changed successfully!', type: 'success'});
      });
    }
  }
  removeBannerImage() {
    if (this.shop.bannerImage && !this.isBannerUploaded) {
      if(confirm('Are you sure to remove banner?')) {
        this.isBannerImageUploading.start();
        this.authShopContributorService.removeBannerImage({
          file: this.shop.bannerImage
        }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.isBannerImageUploading.stop()}))
          .subscribe(result => {
            this.bannerImage = '';
            this.shop.bannerImage = '';
            this.sharedShopService.shop.next(this.shop);
            WsToastService.toastSubject.next({ content: 'Banner is removed!', type: 'success' });
          })
      }
    }
    else if(this.shop.bannerImage) {
      this.bannerImage = environment.IMAGE_URL + this.shop.bannerImage;
      this.isBannerUploaded = false;
    }
    else {
      this.bannerImage = '';
      this.isBannerUploaded = false;
    }
  }
  profileImageFileChangeEvent(event) {
    this.isProfileImageUploading.start();
    this.authShopContributorService.editProfileImage({ file: event[0].base64, removeFile: this.shop.profileImage })
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.isProfileImageUploading.stop()}))
    .subscribe(result => {
      this.profileImage = environment.IMAGE_URL + result['data'];
      WsToastService.toastSubject.next({ content: 'Profile image is changed successfully!', type: 'success'});
    });
  }
  bannerFileChangeEvent(event) {
    this.bannerImageFile = event[0];
    this.bannerImage = event[0].url;
    this.isBannerUploaded = true;
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
        this.mapController.markerLng = this.shop.location.coordinates[0];
        this.mapController.markerLat = this.shop.location.coordinates[1];
        this.mapController.mapLng = this.shop.location.coordinates[0];
        this.mapController.mapLat = this.shop.location.coordinates[1];
      }
      this.timetable.operatingHours =
        this.shop.openingInfo.length > 0
          ? JSON.parse(JSON.stringify(this.shop.openingInfo))
          : Timetable.DEFAULT_OPENING_INFO;
      this.shop.openingInfo = this.shop.openingInfo || Timetable.DEFAULT_OPENING_INFO;
      this.timetable.operatingHourRadio = this.shop.openingInfoType;
      this.isShowLocation = this.shop.fullAddress != undefined;
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
        this.contributorController.exists_contributors = result['result'];
        this.sharedShopService.contributorRefresh.next(this.contributorController);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  inviteContributor() {
    if (this.contributorController.new_contributors.length) {
      observableForkJoin(this.contributorController.new_contributors.map(contributor => {
        let obj = {
          contributor: contributor
        }
        return this.authShopAdminService.inviteContributor(obj);
      }))
        .subscribe(result => {
          this.contributorController.exists_contributors = _.union(this.contributorController.exists_contributors, this.contributorController.new_contributors);
          this.contributorController.new_contributors = new Array;
          WsToastService.toastSubject.next({ content: "Contributors are invited!", type: 'success' });
        }, err => {
          WsToastService.toastSubject.next({ content: err.error });
        });
    }
    else {
      WsToastService.toastSubject.next({ content: "Please add member to invite!", type: 'danger' });
    }
  }
  addContributor(user) {
    this.userSuggestions = [];
    this.contributorController.searchText = '';
    if (_.find(this.contributorController.exists_contributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User is already a contributor!", type: 'danger' });
    }
    else if (_.find(this.contributorController.new_contributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User has been added!", type: 'danger' });
    }
    else {
      this.contributorController.new_contributors.push(<Contributor>{
        email: user.email, user_id: user._id, role: this.contributorController.new_role,
        profileImage: user.profileImage, status: 'pending',
        firstName: user.firstName, lastName: user.lastName
      });
    }
  }
  removeContributor(user) {
    _.remove(this.contributorController.new_contributors, (x) => x._id == user._id);
  }
  closePermanently() {
    this.authShopAdminService
      .closePermanently()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        window.location.reload();
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  reactivateFromInactive() {
    this.authShopAdminService
      .reactivateShop()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        window.location.reload();
      });
  }
  quitShop() {
    this.authShopContributorService.leaveShop()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.router.navigate(['/all']);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  openModal(id, element) {
    this.modalService.open(id);
    this.contributorController.selectedContributor = element;
    this.modalService.setElement(id, this.contributorController);
  }
  openShopModal(id, element) {
    this.modalService.open(id);
    this.modalService.setElement(id, this.shop);
  }
  disabledControls(){
    this.isShowLocation = !this.isShowLocation;
  }
  getDateDifference() {
    if (this.shop.status && this.shop.status.status == 'cancel') {
      var oneDay = 24 * 60 * 60 * 1000;
      var firstDate = new Date(this.shop.status.expiryDate);
      var secondDate = new Date();

      let remove_days = Math.round(
        (firstDate.getTime() - secondDate.getTime()) / oneDay
      );
      this.isShopClosing = remove_days > 0 && remove_days <= 14;
      this.isShopClosable = remove_days <= 0;
      this.remove_day_number = remove_days;
    }
  }
  closeModal(id) {
    this.element = '';
    this.modalService.close(id);
  }
}