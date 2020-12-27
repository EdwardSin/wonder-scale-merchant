import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthInvoiceContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInvoiceContributorService {
  id: number = 0;
  allInvoices = [];
  refreshInvoices: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getInvoices(obj) {
    return this.http.post(AuthInvoiceContributorUrl.getInvoicesUrl, obj, this.accessTokenService.getAccessToken());
  }
  addInvoice(invoice) {
    return this.http.post(AuthInvoiceContributorUrl.addInvoiceUrl, invoice, this.accessTokenService.getAccessToken());
  }
  editInvoice(invoice) {
    return this.http.put(AuthInvoiceContributorUrl.editInvoiceUrl + '/' + invoice._id, invoice, this.accessTokenService.getAccessToken());
  }
  updateInvoiceStatus(id, status) {
    return this.http.put(AuthInvoiceContributorUrl.updateInvoiceStatusUrl + '/' + id, status, this.accessTokenService.getAccessToken());
  }
}
