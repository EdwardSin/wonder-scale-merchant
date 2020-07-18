import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthPackageAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPackageAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getShopPackages() {
    return this.http.get(AuthPackageAdminUrl.getShopPackage, this.accessTokenService.getAccessToken());
  }
}
