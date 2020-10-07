import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthTableContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTableContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getTables() {
    return this.http.get(AuthTableContributorUrl.getTablesUrl, this.accessTokenService.getAccessToken());
  }
  getTable(id) {
    return this.http.get(AuthTableContributorUrl.getTableUrl + id, this.accessTokenService.getAccessToken());
  }
  addTable(obj) {
    return this.http.post(AuthTableContributorUrl.addTableUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateTable(obj) {
    return this.http.put(AuthTableContributorUrl.updateTableUrl + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  uploadTables(obj) {
    return this.http.post(AuthTableContributorUrl.uploadTablesUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeTable(id) {
    return this.http.delete(AuthTableContributorUrl.removeTableUrl + id, this.accessTokenService.getAccessToken());
  }
}
