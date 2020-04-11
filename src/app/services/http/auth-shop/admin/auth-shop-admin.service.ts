import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthShopAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';
import { User } from '@objects/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthShopAdminService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  searchContributors(query): Observable<User> {
    return this.http.get<User>(AuthShopAdminUrl.searchContributorUrl + query, this.accessTokenService.getAccessToken());
  }
  inviteContributor(obj) {
    return this.http.put(AuthShopAdminUrl.inviteContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  editContributor(obj) {
    return this.http.put(AuthShopAdminUrl.editContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeContributor(obj) {
    return this.http.put(AuthShopAdminUrl.removeContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  closePermanently() {
    return this.http.put(AuthShopAdminUrl.closePermanentlyUrl, {}, this.accessTokenService.getAccessToken());
  }
  reactivateShop() {
    return this.http.put(AuthShopAdminUrl.reactivateShopUrl, {}, this.accessTokenService.getAccessToken());
  }
}
