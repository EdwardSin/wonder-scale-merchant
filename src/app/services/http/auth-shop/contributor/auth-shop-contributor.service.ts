import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthShopContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthShopContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getContributors() {
    return this.http.get(AuthShopContributorUrl.getContributorsUrl, this.accessTokenService.getAccessToken());
  }
  editProfileImage(obj) {
    return this.http.put(AuthShopContributorUrl.editProfileUrl, obj, this.accessTokenService.getAccessToken());
  }
  editGeneral(obj) {
    return this.http.put(AuthShopContributorUrl.editGeneralUrl, obj, this.accessTokenService.getAccessToken());
  }
  editContact(obj) {
    return this.http.put(AuthShopContributorUrl.editContactUrl, obj, this.accessTokenService.getAccessToken());
  }
  addMedia(obj) {
    return this.http.post(AuthShopContributorUrl.addMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  addBanner(obj) {
    return this.http.put(AuthShopContributorUrl.addBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  editBannerImage(obj) {
    return this.http.put(AuthShopContributorUrl.editBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeBannerImage(obj) {
    return this.http.put(AuthShopContributorUrl.removeBannerUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeMedia(obj) {
    return this.http.put(AuthShopContributorUrl.removeMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  editMedia(obj) {
    return this.http.put(AuthShopContributorUrl.editMediaUrl, obj, this.accessTokenService.getAccessToken());
  }
  joinContributor(obj) {
    return this.http.put(AuthShopContributorUrl.joinContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  rejectContributor(obj) {
    return this.http.put(AuthShopContributorUrl.rejectContributorUrl, obj, this.accessTokenService.getAccessToken());
  }
  leaveShop() {
    return this.http.put(AuthShopContributorUrl.leaveShopUrl, {}, this.accessTokenService.getAccessToken());
  }
  editInformationImages(obj) {
    return this.http.put(AuthShopContributorUrl.editInformationImagesUrl, obj, this.accessTokenService.getAccessToken());
  }
  editInformationImagesOrder(obj) {
    return this.http.put(AuthShopContributorUrl.editInformationImagesOrderUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeInformationImage(obj) {
    return this.http.put(AuthShopContributorUrl.removeInformationImageUrl, obj, this.accessTokenService.getAccessToken());
  }
  advertiseItems(obj) {
    return this.http.post(AuthShopContributorUrl.advertiseItemsUrl, obj, this.accessTokenService.getAccessToken());
  }
  updateNewItemMessage(obj) {
    return this.http.put(AuthShopContributorUrl.updateNewItemMessageUrl, obj, this.accessTokenService.getAccessToken());
  }
}
