import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { Phase } from '@objects/phase';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Store } from '@objects/store';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { SharedStoreService } from '@services/shared/shared-store.service';

@Component({
  selector: 'create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {
  storeServiceType: 'physical' | 'online' = 'physical';
  storeType: 'restaurant' | 'shopping' | 'services';
  phase: Phase<number> = new Phase(1, 8);
  mapController: MapController;
  loading: WsLoading = new WsLoading;
  store: Store;
  selectedPackage: any;
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
    private sharedStoreService: SharedStoreService,
    private authStoreUserService: AuthStoreUserService,
    private http: HttpClient) {
    this.mapController = new MapController(gpsService);
    this.timetable.operatingHours = Timetable.DEFAULT_OPENING_INFO;
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      if (queryParams['package']) {
        this.selectedPackage = queryParams['package'];
        this.phase.setStep(1);
      }
    });
  }
  ngOnInit() {
    this.createBasicForm();
    this.createAddressForm();
    this.createOpeningInfoForm();
    this.createTermAndConditionForm();
    this.getTermAndCondition();
  }
  next() {
    if (this.phase.isStep(1)) {
      if (this.storeServiceType != undefined) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please choose a service type.', type: 'danger' })
      }
    }
    else if (this.phase.isStep(2)) {
      if (this.storeType != undefined) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please choose a store type.', type: 'danger' })
      }
    }
    else if (this.phase.isStep(3)) {
      if (this.basicFormGroup.valid) {
        this.phase.next();
      }
    }
    else if (this.phase.isStep(4)) {
      if (!this.addressFormGroup.value.isShowLocation || this.addressFormGroup.valid) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      }
    }
    else if (this.phase.isStep(5)) {
      if (this.openingInfoFormGroup.valid) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      }
    }
    else if (this.phase.isStep(6)) {
      this.addStore(true);
    }
  }
  createBasicForm() {
    this.basicFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      tel: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.email]],
      website: ['', [Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
      currency: ['MYR', [Validators.required]]
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
  createNewStore() {
    let store = new Store;
    store.serviceType = this.storeServiceType;
    store.type = this.storeType;
    store.serviceType = this.storeServiceType;
    store.name = this.basicFormGroup.value.name;
    store.phone = [this.basicFormGroup.value.tel];
    store.email = _.compact([this.basicFormGroup.value.email]);
    store.website = _.compact([this.basicFormGroup.value.website]);
    store['currency'] = this.basicFormGroup.value.currency;
    store.showAddress = this.addressFormGroup.value.isShowLocation;
    if (this.addressFormGroup.value.isShowLocation) {
      store.fullAddress = {
        address: this.addressFormGroup.value.address,
        state: this.addressFormGroup.value.state,
        postcode: this.addressFormGroup.value.postcode,
        country: this.addressFormGroup.value.country
      };
      store.location = { coordinates: [this.mapController.markerPoint.longitude, this.mapController.markerPoint.latitude] };
    }
    store.openingInfoType = this.timetable.operatingHourRadio;
    store.openingInfo = store.openingInfoType == 'selected_hours' ? this.timetable.operatingHours : [];
    return store;
  }
  addStore(skipPaymentGateway=false) {
    let store = this.createNewStore();
    let obj = {
      ...store,
      // temp remove package
      // selectedPackage: this.selectedPackage
    }
    this.loading.start();
    if (this.termAndConfitionsFormGroup.valid) {
      this.authStoreUserService.addStore(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.store = <Store>result['data'];
          this.phase.next();
          if (skipPaymentGateway) {
            this.phase.next();
          }
          _.delay(() => {
            this.navigateToStore();
          }, 3000);
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        })
    }
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
  navigateToStore() {
    this.router.navigate([], {queryParams: {modal: null}}).then(nav => {
      this.router.navigate(['/stores', this.store.username]);
    });
  }
  // navigateToChangePlan() {
  //   this.phase.setStep(0);
  //   this.router.navigate([], {queryParams:{package: null}, queryParamsHandling: 'merge'});
  // }
  onPackageClicked(event) {
    this.selectedPackage = event;
    this.phase.setStep(1);
  }
}