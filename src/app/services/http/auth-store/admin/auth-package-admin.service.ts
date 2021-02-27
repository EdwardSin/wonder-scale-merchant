import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthPackageAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPackageAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getPackage() {
    return this.http.get(AuthPackageAdminUrl.getStorePackageUrl, {
      ...this.accessTokenService.getAccessToken()
    });
  }
  changePackage(selectedPackage) {
    return this.http.put(AuthPackageAdminUrl.changePackageUrl, {selectedPackage}, {
      ...this.accessTokenService.getAccessToken()
    });
  }
}
