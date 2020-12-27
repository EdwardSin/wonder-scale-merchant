import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthInvoiceConfigurationContributorUrl } from '@enum/url.enum';
import { BehaviorSubject } from 'rxjs';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInvoiceConfigurationContributorService {
  isInvoiceEnabled: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getInvoiceConfiguration() {
    return this.http.get(AuthInvoiceConfigurationContributorUrl.getInvoiceConfigurationUrl, this.accessTokenService.getAccessToken());
  }
  addInvoiceConfiguration(obj) {
    return this.http.post(AuthInvoiceConfigurationContributorUrl.addInvoiceConfigurationUrl, obj, this.accessTokenService.getAccessToken());
  }
}
