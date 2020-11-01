import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthOrderingConfigurationContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOrderingConfigurationContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  startOrderingService() {
    return this.http.post(AuthOrderingConfigurationContributorUrl.startOrderingServiceUrl, {}, this.accessTokenService.getAccessToken());
  }
  getOrderingConfiguration() {
    return this.http.get(AuthOrderingConfigurationContributorUrl.getOrderingConfigurationUrl, this.accessTokenService.getAccessToken());
  }
  renewMerchantCode() {
    return this.http.put(AuthOrderingConfigurationContributorUrl.renewMerchantCodeUrl, {}, this.accessTokenService.getAccessToken());
  }
  addPageRole(obj) {
    return this.http.post(AuthOrderingConfigurationContributorUrl.addPageRoleUrl, obj, this.accessTokenService.getAccessToken());
  }
  addAnonymousPageRole(obj) {
    return this.http.post(AuthOrderingConfigurationContributorUrl.addAnonymousPageRoleUrl, obj, this.accessTokenService.getAccessToken());
  }
  updatePageRole(obj) {
    return this.http.put(AuthOrderingConfigurationContributorUrl.updatePageRoleUrl, obj, this.accessTokenService.getAccessToken());
  }
  removePageRole(id) {
    return this.http.delete(AuthOrderingConfigurationContributorUrl.removePageRoleUrl + id, this.accessTokenService.getAccessToken());
  }
}
