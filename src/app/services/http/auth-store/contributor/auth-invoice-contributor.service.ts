import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthInvoiceContributorUrl } from '@enum/url.enum';
import { Invoice } from '@objects/invoice';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInvoiceContributorService {
  id: number = 0;
  allInvoices: BehaviorSubject<Array<Invoice>> = new BehaviorSubject<Array<Invoice>>([]);
  numberOfAllItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfCurrentTotalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfNewInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfWaitForApprovalInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfPaidInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfInProgressInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfReadyInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numberOfDeliveryInvoices: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  updatedAt: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  
  refreshInvoices: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getInvoices(obj) {
    return this.http.post(AuthInvoiceContributorUrl.getInvoicesUrl, obj, this.accessTokenService.getAccessToken());
  }
  getInvoice(obj) {
    return this.http.get(AuthInvoiceContributorUrl.getInvoiceUrl + '/' + obj._id, this.accessTokenService.getAccessToken());
  }
  addInvoice(invoice) {
    return this.http.post(AuthInvoiceContributorUrl.addInvoiceUrl, invoice, this.accessTokenService.getAccessToken());
  }
  editInvoice(invoice) {
    return this.http.put(AuthInvoiceContributorUrl.editInvoiceUrl + '/' + invoice._id, invoice, this.accessTokenService.getAccessToken());
  }
  updateInvoiceDelivery(invoice) {
    return this.http.put(AuthInvoiceContributorUrl.editInvoiceUrl + '/delivery/' + invoice._id, {delivery: invoice.delivery}, this.accessTokenService.getAccessToken());
  }
  updateInvoiceStatus(id, obj) {
    return this.http.put(AuthInvoiceContributorUrl.updateInvoiceStatusUrl + '/' + id, obj, this.accessTokenService.getAccessToken());
  }
  getInvoiceGroup(obj) {
    return this.http.post(AuthInvoiceContributorUrl.getInvoiceGroupUrl, obj, this.accessTokenService.getAccessToken());
  }
  getUnseenInvoices(obj) {
    return this.http.post(AuthInvoiceContributorUrl.getUnseenInvoicesUrl, obj, this.accessTokenService.getAccessToken());
  }
  refreshDashboardInvoices(item) {
    let allInvoices = this.allInvoices.getValue();
    let updatedInvoices = allInvoices.map(invoice => {
      return invoice._id == item._id ? item : invoice;
    });
    this.allInvoices.next(updatedInvoices);
    this.updatedAt.next(new Date);
  }
  refreshStatusNewToInProgress() {
    let numberOfNewInvoices = this.numberOfNewInvoices.getValue();
    let numberOfInProgressInvoices = this.numberOfInProgressInvoices.getValue();
    this.numberOfNewInvoices.next(--numberOfNewInvoices);
    this.numberOfInProgressInvoices.next(++numberOfInProgressInvoices);
  }
  refreshStatusPaidToInProgress() {
    let numberOfPaidInvoices = this.numberOfPaidInvoices.getValue();
    let numberOfInProgressInvoices = this.numberOfInProgressInvoices.getValue();
    this.numberOfPaidInvoices.next(--numberOfPaidInvoices);
    this.numberOfInProgressInvoices.next(++numberOfInProgressInvoices);
  }
  refreshStatusInProgressToReady() {
    let numberOfInProgressInvoices = this.numberOfInProgressInvoices.getValue();
    let numberOfReadyInvoices = this.numberOfReadyInvoices.getValue();
    this.numberOfInProgressInvoices.next(--numberOfInProgressInvoices);
    this.numberOfReadyInvoices.next(++numberOfReadyInvoices);
  }
  refreshStatusReadyToDelivery() {
    let numberOfReadyInvoices = this.numberOfReadyInvoices.getValue();
    let numberOfDeliveryInvoices = this.numberOfDeliveryInvoices.getValue();
    this.numberOfReadyInvoices.next(--numberOfReadyInvoices);
    this.numberOfDeliveryInvoices.next(++numberOfDeliveryInvoices);
  }
  refreshStatusWaitForApprovalToNew() {
    let numberOfWaitForApprovalInvoices = this.numberOfWaitForApprovalInvoices.getValue();
    let numberOfNewInvoices = this.numberOfNewInvoices.getValue();
    this.numberOfWaitForApprovalInvoices.next(--numberOfWaitForApprovalInvoices);
    this.numberOfNewInvoices.next(++numberOfNewInvoices);
  }
  refreshStatusDeliveryToComplete() {
    let numberOfDeliveryInvoices = this.numberOfDeliveryInvoices.getValue();
    this.numberOfDeliveryInvoices.next(--numberOfDeliveryInvoices);
  }
  refreshStatusPaidToNew() {
    let numberOfPaidInvoices = this.numberOfPaidInvoices.getValue();
    let numberOfNewInvoices = this.numberOfNewInvoices.getValue();
    this.numberOfPaidInvoices.next(--numberOfPaidInvoices);
    this.numberOfNewInvoices.next(++numberOfNewInvoices);
  }
}
