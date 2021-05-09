import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDeliveryContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDeliveryContributorService {
  refreshDeliveries: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getDeliveries(obj) {
    return this.http.get(AuthDeliveryContributorUrl.getDeliveriesUrl, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        ...obj
      }
    });
  }
  addDelivery(obj) {
    return this.http.post(AuthDeliveryContributorUrl.addDeliveryUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateDelivery(obj) {
    return this.http.put(AuthDeliveryContributorUrl.addDeliveryUrl + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  removeDelivery(_id) {
    return this.http.delete(AuthDeliveryContributorUrl.removeDeliveryUrl + _id, this.accessTokenService.getAccessToken());
  }
}
