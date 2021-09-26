import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Phase } from '@objects/phase';
import { Moment } from 'moment';
import * as moment from 'moment';
import _ from 'lodash';
import { interval, Subject, Subscription, timer } from 'rxjs';
import { environment } from '@environments/environment';
import * as braintree from 'braintree-web';
import { ViewChild } from '@angular/core';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthAdvertisementContributorService } from '@services/http/auth-store/contributor/auth-advertisement-contributor.service';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { URLValidator } from '@validations/url.validator';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { AdsConfiguration } from '@objects/server-configuration';
import { Store } from '@objects/store';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    return 1;
 } 
}

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.scss'],
  providers: [{provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    }]
})
export class AdvertisingComponent implements OnInit {
  store: Store;
  advertisings = [];
  loading: WsLoading = new WsLoading();
  analysisLoading: WsLoading = new WsLoading();
  editingAdsLoading: WsLoading = new WsLoading();
  submitLoading: WsLoading = new WsLoading();
  isModifyAdvertisingModalOpened: boolean;
  isAdvertisementModalOpened: boolean;
  isDisplayAdvertisementExample: boolean;
  isAdvertisingPolicyOpened: boolean;
  isEditAdvertisementOpened: boolean;
  isAdsFree: boolean = false;
  phase: Phase<number> = new Phase(0, 4);
  selectedAdvertisement;
  minDate = new Date;
  isAcceptAgreement: boolean;
  isAdvertisementEnabledModalOpened: boolean;
  isAdvertisementDisabledModalOpened: boolean;
  confirmationLoading: WsLoading = new WsLoading();
  configLoading: WsLoading = new WsLoading();
  paymentLoading: WsLoading = new WsLoading();
  adsConfiguration: AdsConfiguration;
  configuration = this.getConfiguration();
  maxWidth: number = 800;
  week: number = 0;
  totalAmount: number = 0;
  environment = environment;
  today: Date = new Date;
  availableAdvertisementsDates = {};
  advertisingPolicy = '';
  REFRESH_ADVERTISEMENT_INTERVAL = 2 * 60 * 1000;
  exampleImages = [];
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild('picker') datepicker: MatDatepicker<any>;
  @ViewChild('submit', {static: false}) submit: ElementRef;
  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    let isBetweenDates = true;
    if (this.isAdsFree) {
      // Only available for 1 week if it is free advertisement
      isBetweenDates = moment(d || new Date()) < moment(this.configuration.startDate).add(8, 'days');
    }
    if (this.configuration.startDate) {
      const date = moment(d || new Date()).subtract(6, 'days').format('YYYY/MM/DD');
      return day === 0 && this.availableAdvertisementsDates[date] > 0 && d > new Date(this.configuration.startDate) && isBetweenDates;
    } else {
      const date = moment(d || new Date()).format('YYYY/MM/DD');
      return day === 1 && this.availableAdvertisementsDates[date] > 0;
    }
  }
  constructor(private ref: ChangeDetectorRef,
    private http: HttpClient,
    private sharedStoreService: SharedStoreService,
    private authAdvertisementContributorService: AuthAdvertisementContributorService) {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          DocumentHelper.setWindowTitleWithWonderScale('Advertising - ' + result.name);
          this.store = result;
        }
      })
  }
  ngOnInit(): void {
    this.getAdvertisements(true);
    this.refreshAdvertisements();
    this.minDate = moment().startOf('isoWeek').add(1, 'week').toDate();
  }
  createBraintreeClient() {
    this.ref.detectChanges();
    this.paymentLoading.start();
    braintree.client.create({
      authorization: environment.BRAINTREE_AUTHORIZATION
    }, (clientErr, clientInstance) => {
      if (clientErr) {
        return;
      }
      var options = {
        client: clientInstance,
        styles: {
          input: {
            'font-size': '14px'
          },
          'input.invalid': {
            color: 'red'
          },
          'input.valid': {
            color: 'green'
          }
        },
        fields: {
          cardholderName: {
            selector: '#cardholder-name',
            placeholder: 'John Doe'
          },
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10/' + (new Date().getFullYear() + 3)
          }
        }
      }
      this.createHostedFields(options);
    });
  }
  createHostedFields(options) {
    braintree.hostedFields.create(options, (hostedFieldsErr, hostedFieldsInstance) => {
      if (hostedFieldsErr) {
        // WsToastService.toastSubject.next({ content: hostedFieldsErr.message, type: 'danger'});
        console.error(hostedFieldsErr);
        return;
      }
      if (this.submit.nativeElement) {
        this.submit.nativeElement.addEventListener('click', (event) => {
          event.preventDefault();
          this.submit.nativeElement.disabled = true;
          hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
              this.submit.nativeElement.disabled = false;
              WsToastService.toastSubject.next({ content: tokenizeErr.message, type: 'danger'});
              return;
            }
            this.placeorder(payload);
          });
        }, false);
        this.paymentLoading.stop();
      }
    });
  }
  placeorder(payload) {
    let obj = {
      ...this.configuration,
      amount: this.totalAmount,
      isAdsFree: this.isAdsFree
    };
    if (payload) {
      obj['paymentMethodNonce'] = payload.nonce;
    }
    this.submitLoading.start();
    this.authAdvertisementContributorService.addAdvertisement(obj).pipe(takeUntil((this.ngUnsubscribe)), finalize(() => {
      if (this.submit?.nativeElement) {
        this.submit.nativeElement.disabled = false;
      }
      this.submitLoading.stop();
    })).subscribe(result => {
      if (result && result['result']) {
        this.isModifyAdvertisingModalOpened = false;
        this.getAdvertisements();
        WsToastService.toastSubject.next({ content: 'Wait for the approval.<br/>It will take 1-2 days.<br/>Payment will not be proceed until it is approved.', type: 'success'});
      } else {
        WsToastService.toastSubject.next({ content: 'The selected date is full, kindly select other date.', type: 'danger'});
      }
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger'});
    });
  }
  editAdvertisement() {
    this.submitLoading.start();
    this.authAdvertisementContributorService.editAdvertisement(this.configuration).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.submitLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.isEditAdvertisementOpened = false;
        this.getAdvertisements();
        WsToastService.toastSubject.next({ content: 'Wait for the approval.<br/>It will take 1-2 days.<br/>Payment will not be proceed until it is approved.', type: 'success'});
      } else {
        WsToastService.toastSubject.next({ content: 'Server Error!<br/>Kindly contact the admin!', type: 'danger' });
      }
    });
  }
  getAvailableAdvertisements() {
    let obj = {
      type: this.configuration.type
    }
    this.authAdvertisementContributorService.getAvailableAdvertisementDates(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.availableAdvertisementsDates = result['result'];
    });
  }
  getAdvertisementAmount() {
    let advertisementAmount = 0;
    switch (this.configuration.type) {
      case 'pop-out':
        advertisementAmount = this.adsConfiguration.advertisementPopOutAmount * (100 - this.adsConfiguration?.advertisementDiscountPercentage) / 100; break;
      case 'large':
        advertisementAmount = this.adsConfiguration.advertisementBannerLargeAmount * (100 - this.adsConfiguration?.advertisementDiscountPercentage) / 100; break;
      case 'medium':
        advertisementAmount = this.adsConfiguration.advertisementBannerMediumAmount * (100 - this.adsConfiguration?.advertisementDiscountPercentage) / 100; break;
      case 'small':
        advertisementAmount = this.adsConfiguration.advertisementBannerSmallAmount * (100 - this.adsConfiguration?.advertisementDiscountPercentage) / 100; break;
      case 'square':
        advertisementAmount = this.adsConfiguration.advertisementBannerSquareAmount * (100 - this.adsConfiguration?.advertisementDiscountPercentage) / 100; break;
    }
    advertisementAmount *= this.week;
    this.configuration.adsAmount = advertisementAmount;
    if (this.configuration.type === 'pop-out' || this.configuration.type === 'square' || this.configuration.type === 'large') {
      if (!this.isAdsFree && this.configuration.isFbPromoting) {
        advertisementAmount += this.adsConfiguration.advertisementBannerFBAmount;
        this.configuration.fbAmount = this.adsConfiguration.advertisementBannerFBAmount;
      }
      if (!this.isAdsFree && this.configuration.isInstaPromoting) {
        advertisementAmount += this.adsConfiguration.advertisementBannerInstaAmount;
        this.configuration.instaAmount = this.adsConfiguration.advertisementBannerInstaAmount;
      }
    }
    return advertisementAmount;
  }
  openAdvertisingModal() {
    this.phase.reset();
    this.maxWidth = 800;
    this.isModifyAdvertisingModalOpened = true;
    this.isAcceptAgreement = false;
    this.isAdsFree = false;
    this.configuration = this.getConfiguration();
    this.getAdvertisementConfiguration();
  }
  onImageChange(event) {
    this.configuration.imageUrl = event[0].base64;
    this.configuration.image = event[0].base64.replace(/^data:image\/\w+;base64,/, '');
  }
  getConfiguration() {
    return {
      type: '',
      store: null,
      isFbPromoting: false,
      isInstaPromoting: false,
      pageClickedType: 'local',
      imageUrl: '',
      image: null,
      url: '',
      description: '',
      startDate: null,
      endDate: null,
      reason: undefined,
      fbAmount: null,
      instaAmount: null,
      adsAmount: null
    }
  }
  getAdvertisementConfiguration() {
    this.configLoading.start();
    this.authAdvertisementContributorService.getAdvertisementConfiguration().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.configLoading.stop())).subscribe(result => {
      this.adsConfiguration = result['result'];
      if (!this.adsConfiguration.isEnabledFreeAdvertisement || !this.adsConfiguration.isFreeAvailable) {
        this.phase.setStep(1);
      }
    });
  }
  getAdvertisements(isLoading=false) {
    if (isLoading) {
      this.loading.start();
    }
    this.authAdvertisementContributorService.getAdvertisements().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.advertisings = this.updateIsRunning(result?.['result']);
    });
  }
  updateIsRunning(advertisings) {
    for (let advertising of advertisings) {
      if (advertising?.status === 'approved' &&
        new Date(advertising?.startDate).getTime() < this.today.getTime() &&
        new Date(advertising?.endDate).getTime() > this.today.getTime()
      ) {
        advertising.status = 'in_progress';
      } else if (advertising?.status === 'approved' &&
        new Date(advertising?.endDate).getTime() < this.today.getTime()
      ) {
        advertising.status = 'finished';
      }
    }
    return advertisings;
  }
  prevStartDate
  prevEndDate
  openDatePicker() {
    this.prevStartDate = this.configuration.startDate;
    this.prevEndDate = this.configuration.endDate;
    this.configuration.startDate = null;
    this.configuration.endDate = null;
    this.datepicker.open();
  }
  startDateChange() {
    this.datepicker.close();
    if (this.isEditAdvertisementOpened) {
      this.configuration.endDate = moment(this.configuration.startDate).add(this.week, 'week').subtract(1, 'day').toDate();
    } else {
      _.delay(() => {
        this.datepicker.open();
      }, 100);
    }
  }
  openStartAdvertisingModal() {
    this.isAdvertisementEnabledModalOpened = true;
  }
  openStopAdvertisingModal() {
    this.isAdvertisementDisabledModalOpened = true;
  }
  stopAdvertising() {
    this.submitLoading.start();
    this.authAdvertisementContributorService.stopAdvertising(this.selectedAdvertisement._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.submitLoading.stop())).subscribe(result => {
      if (result['result']) {
        this.selectedAdvertisement.isEnabled = true;
        WsToastService.toastSubject.next({ content: 'Advertisement is stopped advertising!', type: 'success'});
        this.getAdvertisements();
        this.isAdvertisementDisabledModalOpened = false;
      }
    });
  }
  startAdvertising() {
    this.submitLoading.start();
    this.authAdvertisementContributorService.startAdvertising(this.selectedAdvertisement._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.submitLoading.stop())).subscribe(result => {
      if (result['result']) {
        this.selectedAdvertisement.isEnabled = true;
        WsToastService.toastSubject.next({ content: 'Advertisement is started advertising!', type: 'success'});
        this.getAdvertisements();
        this.isAdvertisementEnabledModalOpened = false;
      }
    });
  }
  closeDatePicker() {
    if (!this.configuration.startDate && this.prevStartDate) {
      this.configuration.startDate = this.prevStartDate;
    }
    if (this.isEditAdvertisementOpened && this.configuration.startDate && !this.configuration.endDate && this.prevEndDate) {
      this.configuration.endDate = this.prevEndDate;
    }
  }
  refreshAdvertisementsInterval: Subscription;
  refreshAdvertisements() {
    if (this.refreshAdvertisementsInterval) {
      this.refreshAdvertisementsInterval.unsubscribe();
    }
    this.refreshAdvertisementsInterval = interval(this.REFRESH_ADVERTISEMENT_INTERVAL).pipe(switchMap(() => {
        return this.authAdvertisementContributorService.getAdvertisements();
    }), takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.advertisings = this.updateIsRunning(result?.['result']);
    });
  }
  chosenDayHandler(normalizedDay: Moment, datepicker:MatDatepicker<Moment>, date) {
    const ctrlValue = date.value;
    ctrlValue.date(normalizedDay.date());
    ctrlValue.month(normalizedDay.month());
    ctrlValue.year(normalizedDay.year());
    date.setValue(ctrlValue);
    datepicker.close();
  }
  nextToAdsConfig(type) {
    if (this.isAdsFree) {
      if (!this.store?.isPublished) {
        WsToastService.toastSubject.next({ content: 'Store is not published yet!', type: 'danger'});
        return;
      }
      if (this.store?.numberOfPublishedItems === 0) {
        WsToastService.toastSubject.next({ content: 'At least 1 product should be displayed publicly!', type: 'danger'});
        return;
      }
    }
    this.week = 0;
    this.configuration.type = type;
    this.configuration.imageUrl = '';
    this.configuration.store = {
      username: this.store.username
    };
    if (this.configuration.type === 'medium') {
      this.maxWidth = 1180;
    } else {
      this.maxWidth = 800;
    }
    window.scrollTo({top: 0});
    this.phase.next();
    if (this.adsConfiguration.isEnabledFreeAdvertisement && 
        (this.configuration.type === 'pop-out' || 
        this.configuration.type === 'square' ||
        this.configuration.type === 'large')) {
          this.configuration.isFbPromoting = true;
          this.configuration.isInstaPromoting = true;
    }
    this.getAvailableAdvertisements();
  }
  previousToAdsType() {
    this.maxWidth = 800;
    this.configuration = this.getConfiguration();
    this.phase.previous();
  }
  previousToAdsFreePaidType() {
    this.maxWidth = 800;
    this.phase.previous();
  }
  showConfirmation() {
    if (!this.configuration.type) {
      WsToastService.toastSubject.next({content: 'Please select an advertisement type!', type: 'danger'});
      return;
    } else if (!this.configuration.imageUrl) {
      WsToastService.toastSubject.next({content: 'Please upload an advertising image!', type: 'danger'});
      return;
    } else if (!this.configuration.startDate) {
      WsToastService.toastSubject.next({content: 'Please select start week!', type: 'danger'});
      return;
    } else if (!this.configuration.endDate) {
      WsToastService.toastSubject.next({content: 'Please select end week!', type: 'danger'});
      return;
    } else if (this.configuration.pageClickedType === 'custom' && (!this.configuration.url || !this.configuration.url.trim())) {
      WsToastService.toastSubject.next({content: 'Please enter page url after clicking!', type: 'danger'});
      return;
    } else if (this.configuration.pageClickedType === 'custom' && !URLValidator.validate(this.configuration.url)) {
      WsToastService.toastSubject.next({content: 'Please enter a valid page url!', type: 'danger'});
      return;
    } else if (this.week <= 0) {
      WsToastService.toastSubject.next({content: 'Please enter a valid date range!', type: 'danger'});
      return;
    } else if (this.configuration.pageClickedType === 'local' && !this.store?.isPublished) {
      WsToastService.toastSubject.next({content: 'Please publish your store if you want to advertise your page!', type: 'danger'});
      return;
    }
    this.totalAmount = this.getAdvertisementAmount();
    this.phase.next();
    this.confirmationLoading.start();
    _.delay(() => {
      this.confirmationLoading.stop();
      this.configuration = {...this.configuration};
      if (!this.isAdsFree) {
        this.createBraintreeClient();
      }
    }, 1000);
  }
  onEditAdsModalClicked(advertisement) {
    this.isEditAdvertisementOpened = true;
    this.selectedAdvertisement = null;
    this.configuration = null;
    this.editingAdsLoading.start();
    this.paymentLoading.start();
    this.getAdvertisementConfiguration();
    this.authAdvertisementContributorService.getAdvertisement(advertisement._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editingAdsLoading.stop())).subscribe(result => {
      this.selectedAdvertisement = result['result'];
      this.configuration = this.selectedAdvertisement;
      this.isAdsFree = this.selectedAdvertisement.isAdsFree;
      this.calculateWeek();
      this.totalAmount = this.selectedAdvertisement.amount;
      this.getAvailableAdvertisements();
      if (this.selectedAdvertisement?.status === 'rejected' && this.selectedAdvertisement?.reason === 'payment-error') {
        _.delay(() => {
          this.createBraintreeClient();
        }, 1000);
      }
    });
  }
  onEditAdsClicked(advertisement) {
    this.submitLoading.start();
    this.authAdvertisementContributorService.editAdvertisement(advertisement).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.submitLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.isEditAdvertisementOpened = false;
        this.getAdvertisements();
        WsToastService.toastSubject.next({ content: 'Wait for the approval.<br/>It will take 1-2 days.<br/>Payment will not be proceed until it is approved.', type: 'success'});
      }
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger'});
    });
  }
  onViewAdsClicked(advertisement) {
    this.isAdvertisementModalOpened = true;
    this.analysisLoading.start();
    this.selectedAdvertisement = null;
    this.authAdvertisementContributorService.getAdvertisement(advertisement._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.analysisLoading.stop())).subscribe(result => {
      this.selectedAdvertisement = result['result'];
      if (this.selectedAdvertisement) {
        this.selectedAdvertisement = this.updateIsRunning([this.selectedAdvertisement])[0];
      }
    });
  }
  onAdvertisementTypeClicked(type) {
    this.isAdsFree = type === 'free';
    this.phase.next();
  }
  onImageExampleClicked(event, images=[]) {
    event.stopPropagation();
    if (images.length) {
      this.isDisplayAdvertisementExample = true;
      this.exampleImages = images;
    }
  }
  calculateWeek() {
    this.week = moment(this.configuration.endDate).diff(moment(this.configuration.startDate), 'weeks') + 1;
  }
  onViewAdsClosed() {
    this.isAdvertisementModalOpened = false;
    this.selectedAdvertisement = null;
  }
  viewTermAndCondition() {
    this.isAdvertisingPolicyOpened = true;
    this.http.get('/assets/text/advertisingPolicy.txt', { responseType: 'text' }).pipe(
    takeUntil(this.ngUnsubscribe)).subscribe((result: string) => {
      this.advertisingPolicy = result;
    })
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
