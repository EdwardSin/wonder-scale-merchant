import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthPromotionContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPromotionContributorService {
  refreshPromotions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getPromotions(obj) {
    return this.http.get(AuthPromotionContributorUrl.getPromotionsUrl, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        ...obj
      }
    });
  }
  addPromotion(obj) {
    return this.http.post(AuthPromotionContributorUrl.addPromotionUrl, obj, this.accessTokenService.getAccessToken());
  }
  updatePromotion(obj) {
    return this.http.put(AuthPromotionContributorUrl.addPromotionUrl + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  removePromotion(_id) {
    return this.http.delete(AuthPromotionContributorUrl.removePromotionUrl + _id, this.accessTokenService.getAccessToken());
  }
}
