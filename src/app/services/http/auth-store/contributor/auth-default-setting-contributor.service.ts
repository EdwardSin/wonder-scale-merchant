import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDefaultSettingContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-store/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDefaultSettingContributorService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getDefaultItemSettingByStoreId() {
    return this.http.get(AuthDefaultSettingContributorUrl.getDefaultItemSettingByStoreIdUrl, this.accessTokenService.getAccessToken());
  }
}
