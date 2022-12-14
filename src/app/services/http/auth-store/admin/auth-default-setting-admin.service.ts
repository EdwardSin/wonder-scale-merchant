import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthDefaultSettingAdminUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-store/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDefaultSettingAdminService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  updateApprovalInvoice(obj) {
    return this.http.put(AuthDefaultSettingAdminUrl.updateApprovalInvoiceUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateToStartReceivingInvoices() {
    return this.http.put(AuthDefaultSettingAdminUrl.updateToStartReceivingInvoicesUrl, {}, this.accessTokenService.getAccessToken());
  }
  updateToStopReceivingInvoices() {
    return this.http.put(AuthDefaultSettingAdminUrl.updateToStopReceivingInvoicesUrl, {}, this.accessTokenService.getAccessToken());
  }
  getDefaultSettingByStoreId() {
    return this.http.get(AuthDefaultSettingAdminUrl.getDefaultSettingByStoreIdUrl, this.accessTokenService.getAccessToken());
  }
  setDefaultSettingByStoreId(obj) {
    return this.http.put(AuthDefaultSettingAdminUrl.setDefaultSettingByStoreIdUrl, obj, this.accessTokenService.getAccessToken());
  }
}
