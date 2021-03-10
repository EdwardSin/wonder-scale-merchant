import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthAnalysisContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';
import * as moment from 'moment';
import { DateTimeHelper } from '@helpers/datetimehelper/datetime.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthAnalysisContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getGeneralAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getGeneralAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getMonthSalesAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getMonthSalesAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getSalesBetweenDates(fromDate, toDate) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getSalesBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getSalesDetailsBetweenDates(fromDate, toDate, preview) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getSalesDetailsBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate, preview}, this.accessTokenService.getAccessToken());
  }
  getMonthlySalesDetailsBetweenDates(fromDate, toDate, preview) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getMonthlySalesDetailsBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate, preview}, this.accessTokenService.getAccessToken());
  }
  getYearlySalesDetailsBetweenDates(fromDate, toDate, preview) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getYearlySalesDetailsBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate, preview}, this.accessTokenService.getAccessToken());
  }
  getSalesDetailsPreviewBetweenDates(fromDate, toDate) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getSalesPreviewBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlySalesAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getYearlySalesAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getMonthDeliveryAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getMonthDeliveryAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getDeliveryBetweenDates(fromDate, toDate) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getDeliveryBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlyDeliveryAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getYearlyDeliveryAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getMonthInvoiceAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getMonthInvoiceAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  getInvoiceBetweenDates(fromDate, toDate) {
    toDate.setDate(toDate.getDate() + 1);
    let _fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    let _toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthAnalysisContributorUrl.getInvoiceBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlyInvoiceAnalysis() {
    let dateAsString = DateTimeHelper.getTodayWithCurrentTimezone().toISOString();
    return this.http.get(AuthAnalysisContributorUrl.getYearlyInvoiceAnalysisUrl + '?date=' + dateAsString, this.accessTokenService.getAccessToken());
  }
  increment(target, duration, value, isDecimal=false) {
    $(target).each(function () {
      $(target).animate({
        value
      }, {
        duration: duration,
        easing: "linear",
        step: function () {
          isDecimal ? 
          $(target).text(Math.floor(this.value).toFixed(2))
          :
          $(target).text(Math.floor(this.value));
        },
        complete: function () {
          if (parseFloat(this.value + 1) != value) {
            if (isDecimal) {
              value = value.toFixed(2);
            }
            $(target).text(value);
          }
        }
      });
    });
  }
}
