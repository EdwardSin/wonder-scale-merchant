import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthSaleContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSaleContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getSalesBetweenDate(obj) {
    return this.http.post(AuthSaleContributorUrl.getSalesBetweenDateUrl, obj, this.accessTokenService.getAccessToken());
  }
}
