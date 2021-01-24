import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthAnalysisContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAnalysisContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getGeneralAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getGeneralAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getMonthSalesAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getMonthSalesAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getSalesBetweenDates(fromDate, toDate) {
    let _fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let _toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1);
    return this.http.post(AuthAnalysisContributorUrl.getSalesBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlySalesAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getYearlySalesAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getMonthDeliveryAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getMonthDeliveryAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getDeliveryBetweenDates(fromDate, toDate) {
    let _fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let _toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1);
    return this.http.post(AuthAnalysisContributorUrl.getDeliveryBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlyDeliveryAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getYearlyDeliveryAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getMonthInvoiceAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getMonthInvoiceAnalysisUrl, this.accessTokenService.getAccessToken());
  }
  getInvoiceBetweenDates(fromDate, toDate) {
    let _fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let _toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1);
    return this.http.post(AuthAnalysisContributorUrl.getInvoiceBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate}, this.accessTokenService.getAccessToken());
  }
  getYearlyInvoiceAnalysis() {
    return this.http.get(AuthAnalysisContributorUrl.getYearlyInvoiceAnalysisUrl, this.accessTokenService.getAccessToken());
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
