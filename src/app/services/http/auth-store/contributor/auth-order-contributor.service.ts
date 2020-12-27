import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthOrderReceiptContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOrderContributorService {
  id: number = 0;
  allOrders = [];
  refreshOrderReceipts: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getOrderReceipts(obj) {
    return this.http.post(AuthOrderReceiptContributorUrl.getOrderReceiptsUrl, obj, this.accessTokenService.getAccessToken());
  }
  addOrderReceipt(order) {
    return this.http.post(AuthOrderReceiptContributorUrl.addOrderReceipteUrl, order, this.accessTokenService.getAccessToken());
  }
  editOrderReceipt(order) {
    return this.http.put(AuthOrderReceiptContributorUrl.editOrderReceipteUrl + '/' + order._id, order, this.accessTokenService.getAccessToken());
  }
  updateOrderReceiptStatus(id, status) {
    return this.http.put(AuthOrderReceiptContributorUrl.updateOrderReceiptStatusUrl + '/' + id, status, this.accessTokenService.getAccessToken());
  }
}
