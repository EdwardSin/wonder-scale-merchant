import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthPackageAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPackageAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  isShopExpiredByUsername(username) {
    return this.http.get(AuthPackageAdminUrl.isPackageExpiredByUsernameUrl + '/' + username);
  }
  getShopPackages() {
    return this.http.get(AuthPackageAdminUrl.getShopPackageUrl, this.accessTokenService.getAccessToken());
  }
  addShopPackage(name) {
    return this.http.post(AuthPackageAdminUrl.addShopPackageUrl, {name}, this.accessTokenService.getAccessToken());
  }
}
