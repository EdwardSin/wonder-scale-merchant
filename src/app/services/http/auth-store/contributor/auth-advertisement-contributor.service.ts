import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthAdvertisementContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdvertisementContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getAdvertisementConfiguration() {
    return this.http.get(AuthAdvertisementContributorUrl.getAdvertisementConfigurationUrl, this.accessTokenService.getAccessToken());
  }
  getAdvertisements() {
    return this.http.get(AuthAdvertisementContributorUrl.getAdvertisementsUrl, this.accessTokenService.getAccessToken());
  }
  addAdvertisement(obj) {
    return this.http.post(AuthAdvertisementContributorUrl.addAdvertisementUrl, obj, this.accessTokenService.getAccessToken());
  }
  editAdvertisement(obj) {
    return this.http.put(AuthAdvertisementContributorUrl.editAdvertisementUrl, obj, this.accessTokenService.getAccessToken());
  }
  getAdvertisement(id) {
    return this.http.get(AuthAdvertisementContributorUrl.getAdvertisementUrl + '/' + id, this.accessTokenService.getAccessToken());
  }
  getAvailableAdvertisementDates(obj) {
    return this.http.post(AuthAdvertisementContributorUrl.getAvailableAdvertisementDatesUrl, obj, this.accessTokenService.getAccessToken());
  }
  startAdvertising(id) {
    return this.http.post(AuthAdvertisementContributorUrl.startAdvertisingUrl, {id}, this.accessTokenService.getAccessToken());
  }
  stopAdvertising(id) {
    return this.http.post(AuthAdvertisementContributorUrl.stopAdvertisingUrl, {id}, this.accessTokenService.getAccessToken());
  }
}
