import { Component, Input, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { OrderReceipt } from '@objects/order-receipt';
import { AuthOrderContributorService } from '@services/http/auth-store/contributor/auth-order-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'order-info-modal',
  templateUrl: './order-info-modal.component.html',
  styleUrls: ['./order-info-modal.component.scss']
})
export class OrderInfoModalComponent extends WsModalComponent implements OnInit {
  @Input() item: OrderReceipt;
  @Input() closeCallback: Function;
  delivery: number = 0;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  reason: String = '';
  isCancelledOpened: boolean;
  isRefundChecked: boolean;
  refundLoading: WsLoading = new WsLoading();
  isModifyOrderModalOpened: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authOrderContributorService: AuthOrderContributorService) { 
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
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refundLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.authOrderContributorService.refreshOrderReceipts.next(true);
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
