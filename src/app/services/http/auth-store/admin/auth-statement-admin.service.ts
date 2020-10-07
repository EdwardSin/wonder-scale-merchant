import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStatementAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStatementAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getStatementsBetweenDate(obj) {
    return this.http.post(AuthStatementAdminUrl.getStatementsBetweenDateUrl, obj, this.accessTokenService.getAccessToken());
  }
}
