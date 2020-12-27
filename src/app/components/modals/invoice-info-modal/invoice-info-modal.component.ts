import { Component, Input, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Invoice } from '@objects/invoice';
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
  @Input() closeCallback: Function;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  reason: String = '';
  isCancelledOpened: boolean;
  isRefundChecked: boolean;
  refundLoading: WsLoading = new WsLoading();
  isModifyInvoiceModalOpened: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authInvoiceContributorService: AuthInvoiceContributorService) { 
    super();
  }
  ngOnInit(): void {
    super.ngOnInit();
  }
  refund() {
    let status = 'cancelled';
    if (this.isRefundChecked) {
      status = 'refunded';
    }
    this.refundLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {status}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refundLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.authInvoiceContributorService.refreshInvoices.next(true);
        this.isCancelledOpened = false;
      }
    }, err => {
      WsToastService.toastSubject.next({content: 'Status cannot be updated!', type: 'danger'});
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
