import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Store } from '@objects/store';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  status: boolean = true;
  username: string;
  store: Store;
  selectedCurrency: string;
  isEditingLoading: WsLoading = new WsLoading;
  isPublishLoading: WsLoading = new WsLoading;
  isUnpublishLoading: WsLoading = new WsLoading;
  isConfirmPublishedModalOpened: boolean;
  isConfirmUnpublishedModalOpened: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private authStoreContributorService: AuthStoreContributorService,
    private authStoreAdminService: AuthStoreAdminService,
    private sharedStoreService: SharedStoreService,
    public currencyService: CurrencyService,) { }

  ngOnInit(): void {
    this.username = this.sharedStoreService.storeUsername;
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      if (result) {
        this.status = result.isPublished;
        this.selectedCurrency = result.currency;
      }
    });
  }
  editGeneral() {
    let obj = {
      currency: this.selectedCurrency
    }
    if (this.isGeneralValidated(this.selectedCurrency)) {
      this.isEditingLoading.start();
      this.authStoreContributorService.editGeneral(obj).pipe(takeUntil(this.ngUnsubscribe), finalize((() => this.isEditingLoading.stop())))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: "Settings are updated!", type: 'success' });
          this.store.currency = this.selectedCurrency;
          this.currencyService.selectedCurrency.next(this.store.currency);
          this.sharedStoreService.store.next(this.store);
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  isGeneralValidated(currency) {
    if(!currency) {
      WsToastService.toastSubject.next({ content: 'Currency is required!', type: 'danger' });
      return false;
    }
    return true;
  }

  clickStatus() {
    if (!this.status && !this.isConfirmPublishedModalOpened) {
      this.isConfirmPublishedModalOpened = true;
    } else if (this.status && !this.isConfirmUnpublishedModalOpened){
      this.isConfirmUnpublishedModalOpened = true;
    }
    return false;
  }
  publishStore() {
    this.isPublishLoading.start();
    this.authStoreAdminService.publishStore()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isPublishLoading.stop())).subscribe(result => {
      this.store.isPublished = true;
      this.status = true;
      this.sharedStoreService.store.next(this.store);
      this.isConfirmPublishedModalOpened = false;
      WsToastService.toastSubject.next({content: 'Store is in operation!', type: 'success'});
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  unpublishStore() {
    this.isUnpublishLoading.start();
    this.authStoreAdminService.unpublishStore()
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isUnpublishLoading.stop()))
    .subscribe(result => {
      this.store.isPublished = false;
      this.status = false;
      this.sharedStoreService.store.next(this.store);
      this.isConfirmUnpublishedModalOpened = false;
      WsToastService.toastSubject.next({ content: 'Store is under maintanence!', type: 'warning' });
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
