import { Component, Input, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { Delivery } from '@objects/delivery';
import { Invoice } from '@objects/invoice';
import { AuthDeliveryContributorService } from '@services/http/auth-store/contributor/auth-delivery-contributor.service';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'invoice-info-modal',
  templateUrl: './invoice-info-modal.component.html',
  styleUrls: ['./invoice-info-modal.component.scss']
})
export class InvoiceInfoModalComponent extends WsModalComponent implements OnInit {
  @Input() item: Invoice;
  environment = environment;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  reason: String = '';
  isCancelledOpened: boolean;
  isRefundChecked: boolean;
  deliveries: Array<Delivery> = [];
  statusLoading: WsLoading = new WsLoading;
  rejectLoading: WsLoading = new WsLoading();
  refundLoading: WsLoading = new WsLoading();
  isModifyInvoiceModalOpened: boolean;
  isRejectInvoiceModalOpened: boolean;
  rejectReason: string = '';
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authInvoiceContributorService: AuthInvoiceContributorService,
    private authDeliveryContributorService: AuthDeliveryContributorService) { 
    super();
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.getDeliveries();
  }
  approve() {
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'wait_for_approval', status: 'new'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'new';
      this.authInvoiceContributorService.refreshStatusWaitForApprovalToNew();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
      this.close();
    }, err => {
      WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
    });
  }
  reject() {
    this.isRejectInvoiceModalOpened = true;
    this.isOpened = false;
  }
  rejectCallback() {
    if (this.reason?.trim()) {
      let obj = {
        fromStatus: 'wait_for_approval',
        status: 'rejected',
        reason: this.reason.trim()
      };
      this.rejectLoading.start();
      this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.rejectLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authInvoiceContributorService.refreshInvoices.next(true);
          this.isRejectInvoiceModalOpened = false;
          this.isOpened = false;
          this.reason = '';
          WsToastService.toastSubject.next({content: 'Order is moved to rejected!', type: 'success'});
        }
      }, err => {
        WsToastService.toastSubject.next({content: 'Status cannot be updated!', type: 'danger'});
      });
    } else {
      WsToastService.toastSubject.next({content: 'Please enter the reason!', type: 'danger'});
    }
  }
  refund() {
    let obj = {
      fromStatus: this.item.status,
      status: 'cancelled',
      reason: this.reason
    };
    if (this.isRefundChecked) {
      obj.status = 'refunded';
    }
    this.refundLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refundLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.authInvoiceContributorService.refreshInvoices.next(true);
        this.isCancelledOpened = false;
        this.isRefundChecked = false;
        this.reason = '';
      }
    }, err => {
      WsToastService.toastSubject.next({content: 'Status cannot be updated!', type: 'danger'});
    });
  }
  copy(event) {
    event.stopPropagation();
    var tempInput = document.createElement("input");
    tempInput.style.cssText = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = environment.URL + 'invoice/?s_id=' + this.item._id + '&r_id=' + this.item.receiptId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    WsToastService.toastSubject.next({ content: 'Link is copied!\n Send the link to your customer!', type: 'success'}); 
  }
  getDeliveries() {
    this.authDeliveryContributorService.getDeliveries(null).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.deliveries = result['result'];
    });
  }
  updateDelivery(event) {
    this.authInvoiceContributorService.updateInvoiceDelivery(event).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      WsToastService.toastSubject.next({content: 'Delivery status is updated!', type: 'success'});
    });
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  close() {
    super.close();
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
