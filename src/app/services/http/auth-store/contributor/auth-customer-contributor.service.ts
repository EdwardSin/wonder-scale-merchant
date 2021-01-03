import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthCustomerContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCustomerContributorService {
  refreshCustomers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getCustomers(obj) {
    return this.http.get(AuthCustomerContributorUrl.getCustomersUrl, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        ...obj
      }
    });
  }
  addCustomer(obj) {
    return this.http.post(AuthCustomerContributorUrl.addCustomerUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateCustomer(obj) {
    return this.http.put(AuthCustomerContributorUrl.addCustomerUrl + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  removeCustomer(_id) {
    return this.http.delete(AuthCustomerContributorUrl.removeCustomerUrl + _id, this.accessTokenService.getAccessToken());
  }
}
