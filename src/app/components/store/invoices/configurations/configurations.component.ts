import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Store } from '@objects/store';
import { AuthDefaultSettingAdminService } from '@services/http/auth-store/admin/auth-default-setting-admin.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  store: Store;
  startService: WsLoading = new WsLoading;
  stopService: WsLoading = new WsLoading;
  approvalFeature: WsLoading = new WsLoading;
  isStartServiceModalOpened: boolean;
  isStopServiceModalOpened: boolean;
  isApprovalModalOpened: boolean;
  isServiceStarted: boolean;
  isApprovalEnabled: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authDefaultSettingAdminService: AuthDefaultSettingAdminService,
    private sharedStoreService: SharedStoreService) { }

  ngOnInit(): void {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      if (result && result.defaultSetting && result.defaultSetting.invoice) {
        this.isServiceStarted = result.defaultSetting.invoice.isPublicReceivable;
        this.isApprovalEnabled = result.defaultSetting.invoice.isApprovalEnabled;
      }
      DocumentHelper.setWindowTitleWithWonderScale('Configurations - ' + this.store.name);
    });
  }
  updateToStartReceivingInvoicesCallback() {
    this.startService.start();
    this.authDefaultSettingAdminService.updateToStartReceivingInvoices().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.startService.stop())).subscribe(result => {
      this.isStartServiceModalOpened = false;
      if (this.store && this.store.defaultSetting && this.store.defaultSetting.invoice) {
        this.store.defaultSetting.invoice.isPublicReceivable = true;
      }
      this.sharedStoreService.store.next(this.store);
    }, error => {
      console.log(error);
      if (error?.status == '403') {
        WsToastService.toastSubject.next({ content: error?.error, type: 'danger'});
      }
    });
  }
  updateToStopReceivingInvoicesCallback() {
    this.stopService.start();
    this.authDefaultSettingAdminService.updateToStopReceivingInvoices().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.stopService.stop())).subscribe(result => {
      this.isStopServiceModalOpened = false;
      if (this.store && this.store.defaultSetting && this.store.defaultSetting.invoice) {
        this.store.defaultSetting.invoice.isPublicReceivable = false;
      }
      this.sharedStoreService.store.next(this.store);
    });
  }
  onApprovalModalClicked(event) {
    if (!event.value) {
      this.isApprovalModalOpened = true;
    } else {
      this.updateApprovalInvoiceCallback(true);
    }
  }
  updateApprovalInvoiceCallback(isApprovalEnabled: boolean) {
    let obj = {
      isApprovalEnabled
    }
    this.authDefaultSettingAdminService.updateApprovalInvoice(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isApprovalModalOpened = false;
      if (this.store && this.store.defaultSetting && this.store.defaultSetting.invoice) {
        this.store.defaultSetting.invoice.isApprovalEnabled = isApprovalEnabled;
      }
      this.sharedStoreService.store.next(this.store);
    });
  }
  cancelApprovalInvoiceCallback() {
    this.isApprovalEnabled = true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
