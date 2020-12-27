import { Component, Input, OnInit } from '@angular/core';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { AuthOrderContributorService } from '@services/http/auth-store/contributor/auth-order-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-order-card',
  templateUrl: './ws-order-card.component.html',
  styleUrls: ['./ws-order-card.component.scss']
})
export class WsOrderCardComponent implements OnInit {
  @Input() item;
  @Input() onOrderInfoModalClick: Function;
  environment = environment;
  hours = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01', '02', '03', '04', '05'];
  mins = ['00', '15', '30', '45'];
  todayDate: Date = new Date;
  receiptLoading: WsLoading = new WsLoading;
  editEtaLoading: WsLoading = new WsLoading;
  statusLoading: WsLoading = new WsLoading;
  form;
  paymentMethod: String;
  isPayslipModalOpened: boolean;
  isPayModalOpened: boolean;
  isEtaDeliveryDateModalOpened: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authOrderContributorService: AuthOrderContributorService) { }

  ngOnInit(): void {
    this.form = WSFormBuilder.createOrderForm();
  }

  payOrder() {
    if (this.paymentMethod) {
      this.statusLoading.start();
      this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status: 'in_progress', paymentMethod: this.paymentMethod}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
        this.item.status = 'paid';
        this.authOrderContributorService.refreshOrderReceipts.next(true);
      });
    } else {
      WsToastService.toastSubject.next({ content: 'Please select a payment method!', type: 'danger'});
    }
  }
  confirmOrder(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status: 'in_progress'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'in_progress';
      this.authOrderContributorService.refreshOrderReceipts.next(true);
    });
  }
  deliveryOrder(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status: 'delivered'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'delivered';
      this.authOrderContributorService.refreshOrderReceipts.next(true);
    });
  }
  completeOrder(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status: 'completed'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'completed';
      this.authOrderContributorService.refreshOrderReceipts.next(true);
    });
  }
  rejectPayslip(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authOrderContributorService.updateOrderReceiptStatus(this.item._id, {status: 'new'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'new';
      this.authOrderContributorService.refreshOrderReceipts.next(true);
    })
  }
  openEtaDeliveryDateModal(event) {
    event.stopPropagation();
    this.isEtaDeliveryDateModalOpened = true;
    if (this.item.delivery && this.item.delivery.etaDate) {
      let etaDate = new Date(this.item.delivery.etaDate);
      this.form.patchValue({
        etaDate: new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate()),
        etaDateTimeHour: ('0' + etaDate.getHours()).slice(-2),
        etaDateTimeMin: ('0' + etaDate.getMinutes()).slice(-2)
      });
    } else {
      this.form.patchValue({
        etaDate: '',
        etaDateTimeHour: '',
        etaDateTimeMin: ''
      });
    }
  }
  editEtaDateTime() {
    let etaDate = this.form.controls['etaDate'].value;
    let etaDateTimeHour = this.form.controls['etaDateTimeHour'].value;
    let etaDateTimeMin = this.form.controls['etaDateTimeMin'].value;
    if (this.isValidatedEtaDate()) {
      etaDate = new Date(etaDate);
      etaDate.setHours(etaDateTimeHour);
      etaDate.setMinutes(etaDateTimeMin);
      this.editEtaLoading.start();
      this.authOrderContributorService.editOrderReceipt({_id: this.item._id, delivery: {etaDate}}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editEtaLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.authOrderContributorService.refreshOrderReceipts.next(true);
          this.isEtaDeliveryDateModalOpened = false;
        }
      })
    }
  }
  removeEtaDateTime() {
    this.editEtaLoading.start();
    this.authOrderContributorService.editOrderReceipt({_id: this.item._id, delivery: {etaDate: null}}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editEtaLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.authOrderContributorService.refreshOrderReceipts.next(true);
        this.isEtaDeliveryDateModalOpened = false;
      }
    })
  }
  isValidatedEtaDate(): boolean {
    let etaDate = this.form.controls['etaDate'].value;
    let etaDateTimeHour = this.form.controls['etaDateTimeHour'].value;
    let etaDateTimeMin = this.form.controls['etaDateTimeMin'].value;
    if (etaDate === '') {
      WsToastService.toastSubject.next({ content: 'Please set estimated date!', type: 'danger'});
      return false;
    } else if (etaDateTimeHour === '') {
      WsToastService.toastSubject.next({ content: 'Please set estimated hour!', type: 'danger'});
      return false;
    } else if (etaDateTimeMin === '') {
      WsToastService.toastSubject.next({ content: 'Please set estimated time!', type: 'danger'});
      return false;
    }
    return true;
  }
  copy(event) {
    event.stopPropagation();
    var tempInput = document.createElement("input");
    tempInput.style.cssText = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = environment.URL + 'order/?s_id=' + this.item._id + '&r_id=' + this.item.receiptId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    WsToastService.toastSubject.next({ content: 'URL is copied!\n Send the link to your customer!', type: 'success'}); 
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
