import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStoreAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-store/access-token.service';
import { User } from '@objects/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreAdminService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  searchContributors(query): Observable<User> {
    return this.http.get<User>(AuthStoreAdminUrl.searchContributorUrl + query, this.accessTokenService.getAccessToken());
  }
  inviteContributor(obj) {
    return this.http.put(AuthStoreAdminUrl.inviteContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  editContributor(obj) {
    return this.http.put(AuthStoreAdminUrl.editContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeContributor(obj) {
    return this.http.put(AuthStoreAdminUrl.removeContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  publishStore() {
    return this.http.put(AuthStoreAdminUrl.publishStoreUrl, {}, this.accessTokenService.getAccessToken());
  }
  unpublishStore() {
    return this.http.put(AuthStoreAdminUrl.unpublishStoreUrl, {}, this.accessTokenService.getAccessToken());
  }
  closePermanently() {
    return this.http.put(AuthStoreAdminUrl.closePermanentlyUrl, {}, this.accessTokenService.getAccessToken());
  }
  reactivateStore() {
    return this.http.put(AuthStoreAdminUrl.reactivateStoreUrl, {}, this.accessTokenService.getAccessToken());
  }
}
