import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthItemContributorUrl } from '@enum/url.enum';
import { Item } from '@objects/item';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthItemContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  markAsNew(items) {
    return this.http.put(AuthItemContributorUrl.markAsNewUrl, { items }, this.accessTokenService.getAccessToken());
  }
  unmarkNew(items) {
    return this.http.put(AuthItemContributorUrl.unmarkNewUrl, { items }, this.accessTokenService.getAccessToken());
  }
  getItemById(id: string) {
    return this.http.get(AuthItemContributorUrl.getItemById + '/' + id, this.accessTokenService.getAccessToken());
  }
  getItemsByCategoryId(id: string): Observable<Object> {
    return this.http.get(AuthItemContributorUrl.getItemsByCategoryIdUrl + '/' + id, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedAllItemsByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedAllItemsByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedNewItemsByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedNewItemsByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedDiscountItemsByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedDiscountItemsByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedPublishItemCategoryByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedPublishItemCategoryByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedUnpublishItemCategoryByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedUnpublishItemCategoryByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedUncategoriedItemCategoryByShopId() {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedUncategoriedItemCategoryByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  activateItems(items) {
    return this.http.put(AuthItemContributorUrl.activateItemsUrl, { items }, this.accessTokenService.getAccessToken());
  }
  inactivateItems(items) {
    return this.http.put(AuthItemContributorUrl.inactivateItemsUrl, { items }, this.accessTokenService.getAccessToken());
  }
  addItem(newItem) {
    return this.http.post(AuthItemContributorUrl.addItemUrl, newItem, this.accessTokenService.getAccessToken());
  }
  editItem(updateItem) {
    return this.http.put(AuthItemContributorUrl.editItemUrl + '/' + updateItem['_id'], updateItem, this.accessTokenService.getAccessToken());
  }
  editMultipleItems(updateItems) {
    return this.http.put(AuthItemContributorUrl.editMultipleItemsUrl, updateItems, this.accessTokenService.getAccessToken());
  }
  editItemTypes(obj) {
    return this.http.put(AuthItemContributorUrl.editItemTypesUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
  removeItemsPermanantly(obj) {
    return this.http.put(AuthItemContributorUrl.removeItemsPermanantlyUrl, obj, this.accessTokenService.getAccessToken());
  }
  uploadItems(obj) {
    return this.http.put(AuthItemContributorUrl.uploadItemsUrl, obj, this.accessTokenService.getAccessToken());
  }
  editProfileImage(obj) {
    return this.http.put(AuthItemContributorUrl.editProfileImageUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
  editDescriptionImage(obj) {
    return this.http.put(AuthItemContributorUrl.editDescriptionImageUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
  editProfileImageIndex(obj) {
    return this.http.put(AuthItemContributorUrl.editProfileImageIndexUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
  removeProfileImage(obj) {
    return this.http.put(AuthItemContributorUrl.removeProfileImageUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
  removeDescriptionImage(obj) {
    return this.http.put(AuthItemContributorUrl.removeDescriptionImageUrl + '/' + obj.item_id, obj, this.accessTokenService.getAccessToken());
  }
}
