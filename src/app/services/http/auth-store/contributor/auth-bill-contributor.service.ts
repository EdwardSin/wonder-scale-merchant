import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthBillContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBillContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getBills() {
    return this.http.get(AuthBillContributorUrl.getBillsUrl, this.accessTokenService.getAccessToken());
  }
}
