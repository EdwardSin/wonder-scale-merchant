import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStoreContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-store/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getContributors() {
    return this.http.get(AuthStoreContributorUrl.getContributorsUrl, this.accessTokenService.getAccessToken());
  }
  editStore(obj) {
    return this.http.put(AuthStoreContributorUrl.editStoreByIdUrl, obj, this.accessTokenService.getAccessToken());
  }
  editProfileImage(obj) {
    return this.http.put(AuthStoreContributorUrl.editProfileUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeProfileImage() {
    return this.http.put(AuthStoreContributorUrl.removeProfileUrl, {}, this.accessTokenService.getAccessToken());
  }
  editGeneral(obj) {
    return this.http.put(AuthStoreContributorUrl.editGeneralUrl, obj, this.accessTokenService.getAccessToken());
  }
  editContact(obj) {
    return this.http.put(AuthStoreContributorUrl.editContactUrl, obj, this.accessTokenService.getAccessToken());
  }
  addMedia(obj) {
    return this.http.post(AuthStoreContributorUrl.addMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  addBanner(obj) {
    return this.http.put(AuthStoreContributorUrl.addBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  editBannerImage(obj) {
    return this.http.put(AuthStoreContributorUrl.editBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeBannerImage(obj) {
    return this.http.put(AuthStoreContributorUrl.removeBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeMedia(obj) {
    return this.http.put(AuthStoreContributorUrl.removeMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  editMedia(obj) {
    return this.http.put(AuthStoreContributorUrl.editMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  joinContributor(storeId) {
    return this.http.put(AuthStoreContributorUrl.joinContributorUrl, {storeid: storeId});
  }
  rejectContributor(storeId) {
    return this.http.put(AuthStoreContributorUrl.rejectContributorUrl, {storeid: storeId});
  }
  leaveStore() {
    return this.http.put(AuthStoreContributorUrl.leaveStoreUrl, {}, this.accessTokenService.getAccessToken());
  }
  editInformationImages(obj) {
    return this.http.put(AuthStoreContributorUrl.editInformationImagesUrl, obj, this.accessTokenService.getAccessToken());
  }
  editInformationImagesOrder(obj) {
    return this.http.put(AuthStoreContributorUrl.editInformationImagesOrderUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeInformationImage(obj) {
    return this.http.put(AuthStoreContributorUrl.removeInformationImageUrl, obj, this.accessTokenService.getAccessToken());
  }
  editMenuImages(obj) {
    return this.http.put(AuthStoreContributorUrl.editMenuImagesUrl, obj, this.accessTokenService.getAccessToken());
  }
  editMenuImagesOrder(obj) {
    return this.http.put(AuthStoreContributorUrl.editMenuImagesOrderUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeMenuImage(obj) {
    return this.http.put(AuthStoreContributorUrl.removeMenuImageUrl, obj, this.accessTokenService.getAccessToken());
  }
  advertiseItems(obj) {
    return this.http.post(AuthStoreContributorUrl.advertiseItemsUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateNewItemMessage(obj) {
    return this.http.put(AuthStoreContributorUrl.updateNewItemMessageUrl, obj, this.accessTokenService.getAccessToken());
  }
}
