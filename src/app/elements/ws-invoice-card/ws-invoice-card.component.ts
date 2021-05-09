import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { Invoice } from '@objects/invoice';
import { AuthInvoiceContributorService } from '@services/http/auth-store/contributor/auth-invoice-contributor.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ws-invoice-card',
  templateUrl: './ws-invoice-card.component.html',
  styleUrls: ['./ws-invoice-card.component.scss']
})
export class WsInvoiceCardComponent implements OnInit {
  @Input() item;
  @Input() onInvoiceInfoModalClick: Function;
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
  isApproveModalOpened: boolean;
  isEtaDeliveryDateModalOpened: boolean;
  allInvoices = [];
  etaDate: Date;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authInvoiceContributorService: AuthInvoiceContributorService) { }

  ngOnInit(): void {
    this.form = WsFormBuilder.createInvoiceForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['item']) {
      this.etaDate = this.getEtaDate(this.item);
    }
  }

  payInvoice() {
    if (this.paymentMethod) {
      this.statusLoading.start();
      this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'new', status: 'in_progress', paymentMethod: this.paymentMethod}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
        this.item.status = 'in_progress';
        this.isPayModalOpened = false;
        this.authInvoiceContributorService.refreshStatusNewToInProgress();
        this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
      }, err => {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      });
    } else {
      WsToastService.toastSubject.next({ content: 'Please select a payment method!', type: 'danger'});
    }
  }
  confirmInvoice(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'paid', status: 'in_progress'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'in_progress';
      this.isPayslipModalOpened = false;
      this.authInvoiceContributorService.refreshStatusPaidToInProgress();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      if (err.status === 400) {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      }
    });
  }
  readyInvoice(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'in_progress', status: 'ready'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'ready';
      this.isPayslipModalOpened = false;
      this.authInvoiceContributorService.refreshStatusInProgressToReady();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      if (err.status === 400) {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      }
    });
  }
  deliveryInvoice(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'ready', status: 'delivered'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'delivered';
      this.authInvoiceContributorService.refreshStatusReadyToDelivery();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      if (err.status === 400) {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      }
    });
  }
  approveInvoice() {
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'wait_for_approval', status: 'new'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'new';
      this.authInvoiceContributorService.refreshStatusWaitForApprovalToNew();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
    });
  }
  completeInvoice(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'delivered', status: 'completed'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'completed';
      this.authInvoiceContributorService.refreshStatusDeliveryToComplete();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      if (err.status === 400) {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      }
    });
  }
  rejectPayslip(event) {
    event.stopPropagation();
    this.statusLoading.start();
    this.authInvoiceContributorService.updateInvoiceStatus(this.item._id, {fromStatus: 'paid', status: 'new'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.statusLoading.stop())).subscribe(result => {
      this.item.status = 'new';
      this.isPayslipModalOpened = false;
      this.authInvoiceContributorService.refreshStatusPaidToNew();
      this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
    }, err => {
      if (err.status === 400) {
        WsToastService.toastSubject.next({ content: 'Invoice couldn\'t be updated due to status is outdated.', type: 'danger'})
        WsToastService.toastSubject.next({ content: 'Dashboard is up to date.', type: 'info'})
        this.authInvoiceContributorService.refreshInvoices.next(true);
      }
    })
  }
  openEtaDeliveryDateModal(event) {
    event.stopPropagation();
    this.isEtaDeliveryDateModalOpened = true;
    if (this.item.delivery && this.item.delivery.etaDate) {
      let etaDateTimeHour = this.item.delivery.etaHour;
      let etaDateTimeMin = this.item.delivery.etaMin;
      this.form.patchValue({
        etaDate: this.item.delivery.etaDate,
        etaDateTimeHour: etaDateTimeHour !== null && etaDateTimeHour !== undefined? ("0" + etaDateTimeHour).slice(-2): null,
        etaDateTimeMin: etaDateTimeMin !== null && etaDateTimeMin !== undefined ? ("0" + etaDateTimeMin).slice(-2): null
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
    let etaHour = this.form.controls['etaDateTimeHour'].value;
    let etaMin = this.form.controls['etaDateTimeMin'].value;
    if (this.isValidatedEtaDate()) {
      this.editEtaLoading.start();
      this.item.delivery = {
        ...this.item.delivery,
        etaDate,
        etaHour,
        etaMin
      }
      this.authInvoiceContributorService.editInvoice({_id: this.item._id, delivery: this.item.delivery}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editEtaLoading.stop())).subscribe(result => {
        if (result && result['result']) {
          this.etaDate = this.getEtaDate(this.item);
          this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
          this.isEtaDeliveryDateModalOpened = false;
        }
      })
    }
  }
  removeEtaDateTime() {
    this.editEtaLoading.start();
    this.item.delivery = {
      ...this.item.delivery,
      etaDate: null
    }
    this.authInvoiceContributorService.editInvoice({_id: this.item._id, delivery: {etaDate: null}}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editEtaLoading.stop())).subscribe(result => {
      if (result && result['result']) {
        this.etaDate = this.getEtaDate(this.item);
        this.authInvoiceContributorService.refreshDashboardInvoices(this.item);
        this.isEtaDeliveryDateModalOpened = false;
      }
    })
  }
  isValidatedEtaDate(): boolean {
    let etaDate = this.form.controls['etaDate'].value;
    let etaDateTimeHour = this.form.controls['etaDateTimeHour'].value;
    let etaDateTimeMin = this.form.controls['etaDateTimeMin'].value;
    if (!etaDate && (etaDateTimeHour || etaDateTimeMin)) {
      WsToastService.toastSubject.next({ content: 'Please set estimated date!', type: 'danger'});
      return false;
    }
    if ((etaDateTimeHour && !etaDateTimeMin) || (etaDateTimeMin && !etaDateTimeHour)) {
      WsToastService.toastSubject.next({ content: 'Please set a valid estimated time!', type: 'danger'});
      return false;
    }
    if (etaDate && etaDateTimeHour && etaDateTimeMin) {
      if (typeof etaDate !== typeof Date) {
        etaDate = new Date(etaDate);
      }
      let estimatedDateTime = new Date(etaDate.getFullYear(), etaDate.getMonth(), etaDate.getDate(), etaDateTimeHour, etaDateTimeMin);
      if (estimatedDateTime < new Date) {
        WsToastService.toastSubject.next({ content: 'Estimated date time must be later than now!', type: 'danger'});
        return false;
      }
    }
    return true;
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
  getEtaDate(item: Invoice) {
    let etaDate: Date = null;
    if (item && item.delivery && item.delivery.etaDate) {
      etaDate = new Date(item.delivery.etaDate)
      if (item.delivery.etaHour > -1 && item.delivery.etaMin > -1) {
        etaDate.setHours(item.delivery.etaHour);
        etaDate.setMinutes(item.delivery.etaMin);
      }
    }
    return etaDate;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
