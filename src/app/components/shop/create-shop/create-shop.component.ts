import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { Phase } from '@objects/phase';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Shop } from '@objects/shop';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedPackageService } from '@services/shared/shared-package.service';

@Component({
  selector: 'create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit {
  storeServiceType: 'physicalStore' | 'onlineStore' = 'physicalStore';
  storeType: 'restaurant' | 'shopping' | 'services';
  phase: Phase<number> = new Phase(0, 8);
  mapController: MapController;
  loading: WsLoading = new WsLoading;
  shop: Shop;
  selectedPackage: any;
  canTrial: boolean;
  timetable: Timetable = new Timetable;
  currency = {
    currencies: Constants.currencyFullnames,
    values: Constants.currencySymbols,
    keys: Object.keys(Constants.currencyFullnames)
  }
  countries = {
    values: Object.values(Constants.countries)
  }

  basicFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  openingInfoFormGroup: FormGroup;
  termAndConfitionsFormGroup: FormGroup;
  termAndCondition: string;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder,
    private gpsService: WsGpsService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedPackageService: SharedPackageService,
    private sharedShopService: SharedShopService,
    private authShopUserService: AuthShopUserService,
    private http: HttpClient) {
    this.mapController = new MapController(gpsService);
    this.timetable.operatingHours = Timetable.DEFAULT_OPENING_INFO;
  }

  ngOnInit() {
    this.createBasicForm();
    this.createAddressForm();
    this.createOpeningInfoForm();
    this.createTermAndConditionForm();
    this.getTermAndCondition();
    this.sharedPackageService.selectedPackage.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.selectedPackage = result;
        this.phase.next();
      }
    });
    this.sharedShopService.activeShopList.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.canTrial = result.length == 0;
      if (!this.canTrial && this.sharedPackageService.selectedPackage.getValue() == 'trial_6_months') {
        this.phase.setStep(0);
      }
    })
  }
  next() {
    if (this.phase.isStep(0)) {
      // if (this.storeServiceType != undefined) {
        this.phase.next();
      // }
      // else {
      //   WsToastService.toastSubject.next({ content: 'Please choose  a store type.', type: 'danger' })
      // }
    }
    else if (this.phase.isStep(1)) {
      // if (this.storeType != undefined) {
        this.phase.next();
      // }
      // else {
      //   WsToastService.toastSubject.next({ content: 'Please choose  a store service type.', type: 'danger' })
      // }
    }
    else if (this.phase.isStep(2)) {
      // if (this.basicFormGroup.valid) {
        this.phase.next();
      // }
    }
    else if (this.phase.isStep(3)) {
      // if (!this.addressFormGroup.value.isShowLocation || this.addressFormGroup.valid) {
        this.phase.next();
      // }
      // else {
      //   WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      // }
    }
    else if (this.phase.isStep(4)) {
      // if (this.openingInfoFormGroup.valid) {
        this.phase.next();
      // }
      // else {
      //   WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      // }
    } else if (this.phase.isStep(5)) {
      if (this.selectedPackage.type == 'trial_6_months') {
        this.phase.next();
        this.phase.next();
      } else {
        this.phase.next();
      }
    } else if (this.phase.isStep(6)) {
      this.phase.next();
    }
  }
  createBasicForm() {
    this.basicFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      tel: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.email]],
      website: ['', [Validators.minLength(3), Validators.maxLength(128)]],
      currency: ['', [Validators.required]]
    });
  }
  createAddressForm() {
    this.addressFormGroup = this.formBuilder.group({
      isShowLocation: [true],
      searchAddress: [''],
      address: ['', [Validators.required, Validators.maxLength(128)]],
      state: ['', [Validators.required, Validators.maxLength(48)]],
      postcode: ['', [Validators.required, Validators.maxLength(128)]],
      country: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }
  createOpeningInfoForm() {
    this.openingInfoFormGroup = this.formBuilder.group({
      openingInfo: [''],
      openingInfoType: ['']
    });
  }
  createTermAndConditionForm() {
    this.termAndConfitionsFormGroup = this.formBuilder.group({
      accept: ['', Validators.requiredTrue]
    })
  }
  getTermAndCondition() {
    this.http.get("/assets/text/termAndCondition.txt", { responseType: 'text' }).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.termAndCondition = result;
        }
      });
  }
  // selectPackage(event) {
  //   this.selectedPackage = event;
  //   this.phase.next();
  // }
  clear() {
    this.mapController.displayed = false;
    this.mapController.suggestions = [];
  }
  setAddressFormValue() {
    this.addressFormGroup.controls.address.setValue(this.mapController.address.address);
    this.addressFormGroup.controls.state.setValue(this.mapController.address.state);
    this.addressFormGroup.controls.postcode.setValue(this.mapController.address.postcode);
    this.addressFormGroup.controls.country.setValue(this.mapController.address.country);
  }
  createShop() {
    let shop = new Shop;
    shop.type = this.storeType;
    shop.serviceType = this.storeServiceType;
    shop.name = this.basicFormGroup.value.name;
    shop.phone = [this.basicFormGroup.value.tel];
    shop.email = [this.basicFormGroup.value.email];
    shop.website = [this.basicFormGroup.value.website];
    shop['currency'] = this.basicFormGroup.value.currency;
    shop.showAddress = this.addressFormGroup.value.isShowLocation;
    shop.selectedPackage = this.selectedPackage['type'];
    if (this.addressFormGroup.value.isShowLocation) {
      shop.fullAddress = {
        address: this.addressFormGroup.value.address,
        state: this.addressFormGroup.value.state,
        postcode: this.addressFormGroup.value.postcode,
        country: this.addressFormGroup.value.country
      };
      shop.location = { coordinates: [this.mapController.markerPoint.longitude, this.mapController.markerPoint.latitude] };
    }
    shop.openingInfoType = this.timetable.operatingHourRadio;
    shop.openingInfo = shop.openingInfoType == 'selected_hours' ? this.timetable.operatingHours : [];
    this.loading.start();
    if (this.termAndConfitionsFormGroup.valid) {
      this.authShopUserService.addShop(shop).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.shop = <Shop>result['result'];
          this.phase.next();
          _.delay(() => {
            this.navigateToShop();
          }, 3000);
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
        })
    }
  }
  createShopWithSubscription(callbackResult) {
    this.next();
    // let shop = new Shop;
    // shop.type = this.storeType;
    // shop.serviceType = this.storeServiceType;
    // shop.name = this.basicFormGroup.value.name;
    // shop.phone = [this.basicFormGroup.value.tel];
    // shop.email = [this.basicFormGroup.value.email];
    // shop.website = [this.basicFormGroup.value.website];
    // shop['currency'] = this.basicFormGroup.value.currency;
    // shop.showAddress = this.addressFormGroup.value.isShowLocation;
    // shop.selectedPackage = this.selectedPackage['type'];
    // if (this.addressFormGroup.value.isShowLocation) {
    //   shop.fullAddress = {
    //     address: this.addressFormGroup.value.address,
    //     state: this.addressFormGroup.value.state,
    //     postcode: this.addressFormGroup.value.postcode,
    //     country: this.addressFormGroup.value.country
    //   };
    //   shop.location = { coordinates: [this.mapController.markerPoint.longitude, this.mapController.markerPoint.latitude] };
    // }
    // shop.openingInfoType = this.timetable.operatingHourRadio;
    // shop.openingInfo = shop.openingInfoType == 'selected_hours' ? this.timetable.operatingHours : [];
    // let obj = {
    //   shop,
    //   firstName: callbackResult.firstName,
    //   lastName: callbackResult.lastName,
    //   email: callbackResult.email,
    //   phoneNo: callbackResult.phoneNo,
    //   countryName: callbackResult.countryName,
    //   postalCode: callbackResult.postalCode,
    //   paymentMethodNonce: callbackResult.payload.nonce
    // }
    // this.loading.start();
    // if (this.termAndConfitionsFormGroup.valid) {
    //   this.authShopUserService.addShopWithSubscription(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
    //     .subscribe(result => {
    //       this.shop = <Shop>result['result'];
    //       this.phase.next();
    //       _.delay(() => {
    //         this.navigateToShop();
    //       }, 3000);
    //     }, (err) => {
    //       WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
    //     })
    // }
  }
  disabledControls() {
    if (!this.addressFormGroup.value.isShowLocation) {
      this.addressFormGroup.controls.searchAddress.disable();
      this.addressFormGroup.controls.address.disable();
      this.addressFormGroup.controls.state.disable();
      this.addressFormGroup.controls.country.disable();
      this.addressFormGroup.controls.postcode.disable();
    } else {
      this.addressFormGroup.controls.searchAddress.enable();
      this.addressFormGroup.controls.address.enable();
      this.addressFormGroup.controls.state.enable();
      this.addressFormGroup.controls.country.enable();
      this.addressFormGroup.controls.postcode.enable();
    }
  }
  navigateToShop() {
    this.router.navigate([], {queryParams: {modal: null}}).then(nav => {
      this.router.navigate(['/shops', this.shop.username]);
    });
  }
  navigateToChangePlan() {
    this.phase.setStep(0);
  }
}