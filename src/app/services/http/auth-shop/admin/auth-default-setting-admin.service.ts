import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDefaultSettingAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDefaultSettingAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getDefaultSettingByShopId() {
    return this.http.get(AuthDefaultSettingAdminUrl.getDefaultSettingByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  setDefaultSettingByShopId(obj) {
    return this.http.put(AuthDefaultSettingAdminUrl.setDefaultSettingByShopIdUrl, obj, this.accessTokenService.getAccessToken());
  }
}
