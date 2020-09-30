import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthShopContributorUrl, AuthPackageAdminUrl, AuthPackageContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPackageAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  isShopExpiredByUsername(username) {
    return this.http.get(AuthPackageContributorUrl.isPackageExpiredByUsernameUrl + '/' + username, {
      headers: { "access-username": username }
    });
  }
  getShopPackages() {
    return this.http.get(AuthPackageAdminUrl.getShopPackageUrl, this.accessTokenService.getAccessToken());
  }
  changePackage(obj) {
    return this.http.post(AuthPackageAdminUrl.changePackageUrl, obj, this.accessTokenService.getAccessToken());
  }
  unsubscribeProduct(obj) {
    // return this.http.put(AuthPackageAdminUrl.unsubscribePackageUrl, obj, this.accessTokenService.getAccessToken());
  }
}
