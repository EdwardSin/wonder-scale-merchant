import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDefaultSettingContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDefaultSettingContributorService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getDefaultItemSettingByShopId() {
    return this.http.get(AuthDefaultSettingContributorUrl.getDefaultItemSettingByShopIdUrl, this.accessTokenService.getAccessToken());
  }
}
