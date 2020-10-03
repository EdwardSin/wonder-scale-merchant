import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthPaymentMethodAdminService } from '@services/http/auth-shop/admin/auth-payment-method-admin.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import * as braintree from 'braintree-web';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMethods = [];
  loading: WsLoading = new WsLoading;
  currency: string = '';
  modifyCardModalOpened: boolean;
  paymentInstance;
  modifyPaymentMethodModalOpened: boolean;
  paymentGatewayLoading: WsLoading = new WsLoading;
  defaultLoading: WsLoading = new WsLoading;
  changeDefaultPaymentMethodIndex: number = -1;
  removePaymentMethodIndex: number = -1;
  cardholderName: string = '';
  makeDefault: boolean = true;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private authPaymentMethodAdminService: AuthPaymentMethodAdminService,
    private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Payment Methods - ' + shop_name);
    this.getPaymentMethodsByShopId();
  }
  ngAfterViewInit() {
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
  getPaymentMethodsByShopId() {
    this.loading.start();
    //read cards from payment gateway get cards information.
    this.authPaymentMethodAdminService.getPaymentMethodsByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.paymentMethods = result['result'];
        this.loading.stop();
      });
  }
  openModifyPaymentMethodModal() {
    this.modifyPaymentMethodModalOpened = true;
    this.ref.detectChanges();
    this.createPaymentForm();
  }
  addPaymentMethod() {
    this.loading.start();
    let instance = this.paymentInstance;
    if (!this.cardholderName || this.cardholderName.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter cardholder name!' });
      return;
    }
    instance.tokenize((tokenizeErr, payload) => {
      if (tokenizeErr) {
        this.loading.stop();
        if (tokenizeErr.details == undefined) {
          WsToastService.toastSubject.next({ content: 'Postal code is required!', type: 'danger' })
        } else if (tokenizeErr.details && tokenizeErr.details.invalidFieldKeys && tokenizeErr.details.invalidFieldKeys.length) {
          if (tokenizeErr.details.invalidFieldKeys[0] == 'postalCode') {
            WsToastService.toastSubject.next({ content: 'Postal code is invalid!', type: 'danger' })
          } else if (tokenizeErr.details.invalidFieldKeys[0] == 'number') {
            WsToastService.toastSubject.next({ content: 'Card number is invalid!', type: 'danger' })
          } else if (tokenizeErr.details.invalidFieldKeys[0] == 'cvv') {
            WsToastService.toastSubject.next({ content: 'CVV is invlid!', type: 'danger' })
          } else if (tokenizeErr.details.invalidFieldKeys[0] == 'expirationDate') {
            WsToastService.toastSubject.next({ content: 'Card expiration date is invalid!', type: 'danger' })
          }
        }
        console.error(tokenizeErr);
        return;
      } else {
        this.authPaymentMethodAdminService.addPaymentMethod({ paymentMethodNonce: payload.nonce, cardholderName: this.cardholderName, makeDefault: this.makeDefault }).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(result => {
            this.loading.stop();
            this.getPaymentMethodsByShopId();
            this.modifyPaymentMethodModalOpened = false;
            this.cardholderName = '';
          });
      }
    });
  }
  confirmAddPaymentMethod() {
    this.addPaymentMethod();
  }
  deletePaymentMethod(paymentMethod, index) {
    let { token } = paymentMethod;
    if (paymentMethod.default) {
      WsToastService.toastSubject.next({ content: 'Default payment method cannot be deleted!', type: 'danger' });
      return;
    }
    if (confirm('Are you sure to delete the payment method?')) {
      this.removePaymentMethodIndex = index;
      this.authPaymentMethodAdminService.removePaymentMethod({ token }).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.paymentMethods = this.paymentMethods.filter(paymentMethod => {
            return paymentMethod.token != token;
          })
          WsToastService.toastSubject.next({ content: 'Payment method is deleted successfully!', type: 'success' });
          this.removePaymentMethodIndex = -1;
          this.loading.stop();
        });
    }
  }
  setDefaultPaymentMethod(token, index) {
    if (confirm('Are you sure to set the payment method as default?')) {
      this.defaultLoading.start();
      this.changeDefaultPaymentMethodIndex = index;
      this.authPaymentMethodAdminService.setDefaultPaymentMethod({ token }).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.getPaymentMethodsByShopId();
          this.changeDefaultPaymentMethodIndex = -1;
          this.defaultLoading.stop();
          this.loading.stop();
        }, err => {
          this.changeDefaultPaymentMethodIndex = -1;
          this.defaultLoading.stop();
          this.loading.stop();
        });
    }
  }
}
