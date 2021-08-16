import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { PaymentMethodEnum } from '@enum/payment-method.enum';
import { Phase } from '@objects/phase';
import { AuthInvoiceConfigurationContributorService } from '@services/http/auth-store/contributor/auth-invoice-configuration-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  isInvoiceEnabled: boolean;
  phase: Phase<number> = new Phase(0, 3);
  loading: WsLoading = new WsLoading;
  addLoading: WsLoading = new WsLoading;
  store;
  selectedPackage = 'free';
  prefix: string = 'R';
  receivingForm: FormGroup;
  paymentMethods(): Array<string> {
    var keys = Object.keys(PaymentMethodEnum);
    return keys.slice(keys.length / 2);
  }
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private router: Router,
    private sharedStoreService: SharedStoreService,
    private authInvoiceConfigurationContributorService: AuthInvoiceConfigurationContributorService) { }
  ngOnInit(): void {
    this.loading.start();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      if (result && result.package) {
        this.selectedPackage = result.package.name;
      }
    });
    this.authInvoiceConfigurationContributorService.isInvoiceEnabled.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result !== null) {
        this.isInvoiceEnabled = result;
        this.loading.stop();
      }
    });
    let formBuilder = new FormBuilder;
    this.receivingForm = formBuilder.group({
      isPublicReceivable: [false, [Validators.required]],
      bankName: ['', [Validators.required, Validators.maxLength(36)]],
      accountName: ['', [Validators.required, Validators.maxLength(72)]],
      accountNo: ['', [Validators.required, Validators.maxLength(36)]]
    });
  }
  nextToReceivingPhase() {
    this.phase.next();
  }
  startInvoiceFeature() {
    let obj = this.receivingForm.value;
    if (obj.isPublicReceivable) {
      if (!obj.bankName.trim()) {
        WsToastService.toastSubject.next({ content: 'Please enter the bank name!', type: 'danger' });
      } else if (!obj.accountName.trim()) {
        WsToastService.toastSubject.next({ content: 'Please enter the account name!', type: 'danger' });
      } else if (!obj.accountNo.trim()) {
        WsToastService.toastSubject.next({ content: 'Please enter the account number!', type: 'danger' });
      } else if (this.receivingForm.status !== 'VALID') {
        WsToastService.toastSubject.next({ content: 'Please enter the valid details!', type: 'danger' });
      }
    }
    obj['prefix'] = this.prefix ? this.prefix.trim() : '';
    this.addLoading.start();
    this.authInvoiceConfigurationContributorService.startInvoiceFeature(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.addLoading.stop())).subscribe(result => {
      this.store.bankDetails = {
        bankName: obj.bankName.trim(),
        accountName: obj.accountName.trim(),
        accountNo: obj.accountNo.trim(),
        configurationDetails: {
          prefix: this.prefix
        }
      }
      this.sharedStoreService.store.next(this.store);
      this.authInvoiceConfigurationContributorService.isInvoiceEnabled.next(true);
      WsToastService.toastSubject.next({ content: 'Invoice management is enabled!', type: 'success' });
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  upgradeToPremium() {
    this.router.navigate(['/stores/' + this.store.username + '/package'], {queryParams: {returnUrl: '/stores/' + this.store.username + '/invoices/get-started'}})
  }
  ngOnDestoy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
