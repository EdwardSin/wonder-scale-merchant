import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@constants/constants';
import { Phase } from '@objects/phase';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { Shop } from '@objects/shop';
import { Timetable } from '@objects/ws-timetable';
import { MapController } from '@objects/map.controller';
import { WsGpsService } from '@services/general/ws-gps.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit {
  storeType: 'physicalStore' | 'onlineStore' = 'physicalStore';
  storeServiceType: 'restaurant' | 'shopping' | 'services';
  phase: Phase<number> = new Phase(1, 7);
  mapController: MapController;
  loading: WsLoading = new WsLoading;
  shop: Shop;

  timetable: Timetable = new Timetable;
  currency = {
    currencies: Constants.currencyFullname,
    values: Constants.currencySymbols,
    keys: Object.keys(Constants.currencyFullname)
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
  }
  next() {
    if (this.phase.isStep(0)) {
      if (this.storeType != undefined) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please choose  a store type.', type: 'danger' })
      }
    }
    else if (this.phase.isStep(1)) {
      if (this.storeServiceType != undefined) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please choose  a store service type.', type: 'danger' })
      }
    }
    else if (this.phase.isStep(2)) {
      if (this.basicFormGroup.valid) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      }
    }
    else if (this.phase.isStep(3)) {
      if (this.addressFormGroup.valid) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      }
    }
    else if (this.phase.isStep(4)) {
      if (this.openingInfoFormGroup.valid) {
        this.phase.next();
      }
      else {
        WsToastService.toastSubject.next({ content: 'Please complete the form.', type: 'danger' });
      }
    }
  }
  createBasicForm() {
    this.basicFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.email]],
      website: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      currency: ['', [Validators.required]]
    });
  }
  createAddressForm() {
    this.addressFormGroup = this.formBuilder.group({
      search_address: [''],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required]
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
    this.http.get("/assets/images/termAndCondition.txt", { responseType: 'text' }).pipe(
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
    this.addressFormGroup.controls.city.setValue(this.mapController.address.city);
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
    shop.fullAddress = {
      address: this.addressFormGroup.value.address,
      state: this.addressFormGroup.value.state,
      postcode: this.addressFormGroup.value.postcode,
      city: this.addressFormGroup.value.city,
      country: this.addressFormGroup.value.country
    };

    shop.location = { coordinates: [this.mapController.markerLng, this.mapController.markerLat] };
    shop.openingInfoType = this.timetable.operatingHourRadio;
    shop.openingInfo = shop.openingInfoType == 'selected_hours' ? this.timetable.operatingHours : [];
    this.loading.start();
    if (this.termAndConfitionsFormGroup.valid) {
      this.authShopUserService.addShop(shop).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.shop = <Shop>result;
          this.phase.next();
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        })
    }
  }
  navigateToShop() {
    this.router.navigate([{ outlets: { modal: null } }]).then(nav => {
      this.router.navigate(['shops', this.shop.username]);
    });
  }
}