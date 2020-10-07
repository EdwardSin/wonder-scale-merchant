import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthPaymentMethodAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPaymentMethodAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getPaymentMethodsByStoreId() {
    return this.http.get(AuthPaymentMethodAdminUrl.getPaymentMethodsByStoreIdUrl, this.accessTokenService.getAccessToken());
  }
  addPaymentMethod(obj) {
    return this.http.post(AuthPaymentMethodAdminUrl.addPaymentMethodUrl, obj, this.accessTokenService.getAccessToken());
  }
  removePaymentMethod(obj) {
    return this.http.post(AuthPaymentMethodAdminUrl.removePaymentMethodUrl, obj, this.accessTokenService.getAccessToken());
  }
  setDefaultPaymentMethod(obj) {
    return this.http.put(AuthPaymentMethodAdminUrl.setDefaultPaymentMethodUrl, obj, this.accessTokenService.getAccessToken());
  }
}
