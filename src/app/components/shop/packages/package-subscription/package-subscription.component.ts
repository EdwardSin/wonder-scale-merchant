import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '@constants/constants';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { environment } from '@environments/environment';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import * as braintree from 'braintree-web';

@Component({
  selector: 'package-subscription',
  templateUrl: './package-subscription.component.html',
  styleUrls: ['./package-subscription.component.scss']
})
export class PackageSubscriptionComponent implements OnInit {
  @Input() navigateToChangePlan: Function;
  @Input() subscribePackageCallback: Function;
  @Input() selectedPackage;
  @Input() get subscription() { return this._subscription };
  @Output() subscriptionChange: EventEmitter<any> = new EventEmitter;
  subscribeLoading: WsLoading = new WsLoading;
  _subscription;
  paymentInstance;
  countries = {
    values: Object.values(Constants.countries)
  }
  set subscription(val) {
    this._subscription = val;
    this.subscriptionChange.emit(val);
  }
  constructor(private authShopUserService: AuthShopUserService) { }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.createPaymentForm();
  }
  createPaymentForm() {
    // var authorization = environment.braintreeAuthorization;
    // var me = this;
    // braintree.client.create({
    //   authorization: authorization
    // }, function (err, clientInstance) {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   createHostedFields(clientInstance);
    // });

    // function createHostedFields(clientInstance) {
    //   braintree.hostedFields.create({
    //     client: clientInstance,
    //     styles: {
    //       'input': {
    //         'font-size': '16px',
    //         'font-weight': 'lighter',
    //         'color': '#ccc'
    //       },
    //       ':focus': {
    //         'color': 'black'
    //       }
    //     },
    //     fields: {
    //       number: {
    //         selector: '#card-number',
    //         placeholder: '---- ---- ---- ----'
    //       },
    //       cvv: {
    //         selector: '#cvv',
    //         placeholder: '123'
    //       },
    //       expirationDate: {
    //         selector: '#expiration-date',
    //         placeholder: 'MM/YYYY'
    //       },
    //       postalCode: {
    //         selector: '#postal-code',
    //         placeholder: '11111'
    //       }
    //     }
    //   }, function (err, instance) {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }

    //     me.paymentInstance = instance;
    //     // var teardown = function (event) {
    //     //   event.preventDefault();
    //     //   alert('Submit your nonce to your server here!');
    //     //   hostedFieldsInstance.teardown(function () {
    //     //     createHostedFields(clientInstance);
    //     //     form.removeEventListener('submit', teardown, false);
    //     //   });
    //     // };

    //     // form.addEventListener('submit', teardown, false);
    //   });
    // }
  }
  subscribeNow(form) {

    this.subscribePackageCallback();
  //   // this.subscribeLoading.start();
  //   let instance = this.paymentInstance;
  //   instance.tokenize((tokenizeErr, payload) => {
  //     if (tokenizeErr) {
  //       console.error(tokenizeErr);
  //       // this.subscribeLoading.stop();
  //       return;
  //     }
  //     // let obj = {
  //     //   paymentMethodNonce: payload.nonce
  //     // }
  //     console.log(instance);
  //     this.subscribePackageCallback({
  //       firstName: form.firstName,
  //       lastName: form.lastName,
  //       email: form.email,
  //       phoneNo: form.phoneNo,
  //       country: form.country,
  //       // postalCode: form.postalCode,
  //       payload});

  //     // this.saleService.checkout(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.subscribeLoading.stop())).subscribe(result => {
  //     //   if (result && result['result'] && result['result']['success']) {
  //     //     instance.teardown(function (teardownErr) {
  //     //       if (teardownErr) {
  //     //         console.error('Could not tear down the Hosted Fields form!');
  //     //       } else {
  //     //         console.info('Hosted Fields form has been torn down!');
  //     //       }
  //     //     });
  //     //     this.phase.next();
  //     //     window.scrollTo(0, 0);
  //     //     this.sale = result['data'];
  //     //     this.sharedCartService.cartItems.next([]);
  //     //     this.router.navigate([], {queryParams: { s_id: this.sale._id }, queryParamsHandling: 'merge'});
  //     //   } else {
  //     //       this.paymentFail = true;
  //     //       this.phase.next();
  //     //       window.scrollTo(0, 0);
  //     //   }
  //     // });
  //   });
  }
}
