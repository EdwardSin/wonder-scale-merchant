import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthReceiptContributorUrl } from '@enum/url.enum';
import { Receipt } from '@objects/receipt';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthReceiptContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getAllReceiptsByShopId() {
    return this.http.get<{ result: Receipt[] }>(AuthReceiptContributorUrl.getAllReceiptsByShopIdUrl, this.accessTokenService.getAccessToken());
  }
}
