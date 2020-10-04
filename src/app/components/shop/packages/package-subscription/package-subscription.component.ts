import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { Constants } from '@constants/constants';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import * as braintree from 'braintree-web';
import * as moment from 'moment';

@Component({
  selector: 'package-subscription',
  templateUrl: './package-subscription.component.html',
  styleUrls: ['./package-subscription.component.scss']
})
export class PackageSubscriptionComponent implements OnInit {
  @Input() navigateToChangePlan: Function;
  @Input() subscribePackageCallback: Function;
  @Input() changeNextMonthPackageCallback: Function;
  @Input() selectedPackage;
  @Input() subscribingPackage;
  @Input() get subscription() { return this._subscription };
  @Output() subscriptionChange: EventEmitter<any> = new EventEmitter;
  subscribeLoading: WsLoading = new WsLoading;
  paymentGatewayLoading: WsLoading = new WsLoading;
  paymentGatewayForm: FormGroup;
  _subscription;
  paymentInstance;
  isUpgradePackage: boolean;
  countries = {
    values: Object.values(Constants.countries)
  }
  set subscription(val) {
    this._subscription = val;
    this.subscriptionChange.emit(val);
  }
  constructor(private ref: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.paymentGatewayForm = WSFormBuilder.createPaymentGatewayForm();
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['subscribingPackage'] && this.subscribingPackage || this.selectedPackage) {
      this.isUpgradePackage = this.isUpgradePackageFunc();
    }
  }
  ngAfterViewInit() {
    if (this.isUpgradePackage) {
      this.createPaymentForm();
    }
  }
  isUpgradePackageFunc() {
    let todayDate = new Date;
    return !this.subscribingPackage || 
    (this.subscribingPackage.name == 'trial_6_months' && !this.subscribingPackage.next) || 
    (moment(this.subscribingPackage.expiryDate).diff(moment(todayDate), 'days') < 0);
  }
  _changeNextMonthPackageCallback() {
    this.subscribeLoading.start();
    this.changeNextMonthPackageCallback(() => {
      this.subscribeLoading.stop();
    });
  }
  createPaymentForm() {
    var authorization = environment.braintreeAuthorization;
    var me = this;
    this.paymentGatewayLoading.start();
    me.ref.detectChanges();
    braintree.client.create({
      authorization: authorization
    }, function (err, clientInstance) {
      if (err) {
        console.error(err);
        return;
      }
      createHostedFields(clientInstance);
    });

    function createHostedFields(clientInstance) {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14px',
            'font-weight': 'lighter',
            'color': '#000'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '---- ---- ---- ----'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YYYY'
          },
          postalCode: {
            selector: '#postal-code',
            placeholder: 'Postal Code'
          }
        }
      }, function (err, instance) {
        if (err) {
          console.error(err);
          return;
        }
        me.paymentInstance = instance;
        me.paymentGatewayLoading.stop();
        
      });
    }
  }
  subscribeNow() {
    this.subscribeLoading.start();
    let instance = this.paymentInstance;
    let form = this.paymentGatewayForm;
    if (this.isValidate(form)) {
      instance.tokenize((tokenizeErr, payload) => {
        
        if (tokenizeErr) {
          this.subscribeLoading.stop();
          if (tokenizeErr.details == undefined) {
            WsToastService.toastSubject.next({ content: 'Postal code is required!', type: 'danger'})
          } else if (tokenizeErr.details && tokenizeErr.details.invalidFieldKeys && tokenizeErr.details.invalidFieldKeys.length) {
            if (tokenizeErr.details.invalidFieldKeys[0] == 'postalCode') {
              WsToastService.toastSubject.next({ content: 'Postal code is invalid!', type: 'danger'})
            } else if (tokenizeErr.details.invalidFieldKeys[0] == 'number') {
              WsToastService.toastSubject.next({ content: 'Card number is invalid!', type: 'danger'})
            } else if (tokenizeErr.details.invalidFieldKeys[0] == 'cvv') {
              WsToastService.toastSubject.next({ content: 'CVV is invlid!', type: 'danger'})
            } else if (tokenizeErr.details.invalidFieldKeys[0] == 'expirationDate') {
              WsToastService.toastSubject.next({ content: 'Card expiration date is invalid!', type: 'danger'})
            }
          }
          console.error(tokenizeErr);
          return;
        } else {
          this.subscribePackageCallback({
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email,
            phone: form.value.phone,
            countryName: form.value.countryName,
            paymentMethodNonce: payload.nonce }, () => {
              this.subscribeLoading.stop();
          });
        }
      });
    } else {
      this.subscribeLoading.stop();
    }
  }
  isValidate(form) {
    if (form.controls.firstName.errors && form.controls.firstName.errors.required) {
      WsToastService.toastSubject.next({ content: 'First name is required!', type: 'danger'})
      return false;
    } else if (form.controls.firstName.errors && form.controls.firstName.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'First name is too long!', type: 'danger'})
      return false;
    } else if (form.controls.lastName.errors && form.controls.lastName.errors.required) {
      WsToastService.toastSubject.next({ content: 'Last name is required!', type: 'danger'})
      return false;
    } else if (form.controls.lastName.errors && form.controls.lastName.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Last name is too long!', type: 'danger'})
      return false;
    } else if (form.controls.email.errors && form.controls.email.errors.required){
      WsToastService.toastSubject.next({ content: "Email is required!", type: 'danger' });
      return false;
    } else if (form.controls.email.errors && form.controls.email.errors.email){
      WsToastService.toastSubject.next({ content: "Email is invalid!", type: 'danger' });
      return false;
    } else if (form.controls.email.errors && form.controls.email.errors.maxlength){
      WsToastService.toastSubject.next({ content: "Email is too long!", type: 'danger' });
      return false;
    } else if (form.controls.phone.errors && form.controls.phone.errors.required) {
      WsToastService.toastSubject.next({ content: 'Phone is required!', type: 'danger'})
      return false;
    } else if (form.controls.phone.errors && form.controls.phone.errors.maxlength) {
      WsToastService.toastSubject.next({ content: 'Phone is too long!', type: 'danger'})
      return false;
    } else if (form.controls.countryName.errors && form.controls.countryName.errors.required) {
      WsToastService.toastSubject.next({ content: 'Country is required!', type: 'danger'})
      return false;
    }
    return true;
  }
}
