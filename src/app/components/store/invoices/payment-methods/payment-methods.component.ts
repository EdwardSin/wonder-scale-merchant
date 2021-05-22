import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { PaymentMethodEnum } from '@enum/payment-method.enum';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Store } from '@objects/store';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  form: FormGroup;
  store: Store;
  removeBankDetailsLoading: WsLoading = new WsLoading;
  saveLoading: WsLoading = new WsLoading;
  isRemoveBankDetailsModalOpened: boolean;
  paymentMethods(): Array<string> {
    var keys = Object.keys(PaymentMethodEnum);
    return keys.slice(keys.length / 2);
  }
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authStoreAdminService: AuthStoreAdminService,
    private sharedStoreService: SharedStoreService) {
  }

  ngOnInit(): void {
    let formBuilder = new FormBuilder;
    this.form = formBuilder.group({
      bankName: ['', [Validators.required, Validators.maxLength(36)]],
      accountName: ['', [Validators.required, Validators.maxLength(72)]],
      accountNo: ['', [Validators.required, Validators.maxLength(36)]]
    });
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.store = result;
        this.setupBankDetails();
        DocumentHelper.setWindowTitleWithWonderScale('Payment Methods - ' + this.store.name);
      }
    });
  }
  setupBankDetails() {
    if (this.store.bankDetails) {
      this.form.patchValue({
        bankName: this.store.bankDetails.bankName,
        accountName: this.store.bankDetails.accountName,
        accountNo: this.store.bankDetails.accountNo
      });
    }
  }
  editBankDetails() {
    let obj = this.form.value;
    if (!obj.bankName.trim()) {
      WsToastService.toastSubject.next({ content: 'Please enter the bank name!', type: 'danger' });
    } else if (!obj.accountName.trim()) {
      WsToastService.toastSubject.next({ content: 'Please enter the account name!', type: 'danger' });
    } else if (!obj.accountNo.trim()) {
      WsToastService.toastSubject.next({ content: 'Please enter the account number!', type: 'danger' });
    } else if (this.form.status !== 'VALID') {
      WsToastService.toastSubject.next({ content: 'Please enter the valid details!', type: 'danger' });
    } else {
      this.saveLoading.start();
      this.authStoreAdminService.editBankDetails(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.saveLoading.stop())).subscribe(result => {
        this.store.bankDetails = {
          bankName: obj.bankName.trim(),
          accountName: obj.accountName.trim(),
          accountNo: obj.accountNo.trim()
        }
        this.sharedStoreService.store.next(this.store);
        WsToastService.toastSubject.next({ content: 'Successfully update bank details!', type: 'success' });
      });
    }
  }
  clearBankDetails() {
    if (this.store?.defaultSetting?.invoice?.isPublicReceivable) {
      return WsToastService.toastSubject.next({ content: 'Please stop receiving orders from public to clear the bank details!', type: 'danger' });
    }
    this.isRemoveBankDetailsModalOpened = true;
  }
  clearBankDetailsCallback() {
    this.removeBankDetailsLoading.start();
    this.authStoreAdminService.clearBankDetails().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.removeBankDetailsLoading.stop())).subscribe(result => {
        this.form.reset();
        this.store.bankDetails = null;
        this.sharedStoreService.store.next(this.store);
        this.isRemoveBankDetailsModalOpened = false;
      }, error => {
        if (error?.status === 403) {
          WsToastService.toastSubject.next({ content: error?.error, type: 'danger' });
        }
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}