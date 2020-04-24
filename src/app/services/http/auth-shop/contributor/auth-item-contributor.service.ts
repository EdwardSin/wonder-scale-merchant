import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthItemContributorUrl } from '@enum/url.enum';
import { Item } from '@objects/item';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';
import { Observable } from 'rxjs';
import { Result } from '@objects/result';

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
  getItemById(id: string): Observable<Result<Item>>{
    return this.http.get<Result<Item>>(AuthItemContributorUrl.getItemById + '/' + id, this.accessTokenService.getAccessToken());
  }
  getItemsByCategoryId(id: string, keyword, page, order, orderBy): Observable<Object> {
    return this.http.get(AuthItemContributorUrl.getItemsByCategoryIdUrl + '/' + id, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getAuthenticatedAllItemsByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedAllItemsByShopIdUrl, {
      ...this.accessTokenService.getAccessToken(),
      params
    });
  }
  getAuthenticatedNewItemsByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedNewItemsByShopIdUrl,
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  getAuthenticatedDiscountItemsByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedDiscountItemsByShopIdUrl, 
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  getAuthenticatedPublishedItemCategoryByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedPublishedItemCategoryByShopIdUrl, 
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  getAuthenticatedUnpublishedItemCategoryByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedUnpublishedItemCategoryByShopIdUrl, 
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  getAuthenticatedUncategorizedItemCategoryByShopId(params) {
    return this.http.get<{result: Item[]}>(AuthItemContributorUrl.getAuthenticatedUncategorizedItemCategoryByShopIdUrl, 
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  publishItems(items) {
    return this.http.put(AuthItemContributorUrl.activateItemsUrl, { items }, this.accessTokenService.getAccessToken());
  }
  unpublishItems(items) {
    return this.http.put(AuthItemContributorUrl.inactivateItemsUrl, { items }, this.accessTokenService.getAccessToken());
  }
  addItem(newItem): Observable<Result<Item>> {
    return this.http.post<Result<Item>>(AuthItemContributorUrl.addItemUrl, newItem, this.accessTokenService.getAccessToken());
  }
  editItem(updateItem) {
    return this.http.put(AuthItemContributorUrl.editItemUrl + '/' + updateItem['_id'], updateItem, this.accessTokenService.getAccessToken());
  }
  editItemTypes(obj) {
    return this.http.put(AuthItemContributorUrl.editItemTypesUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  editMultipleItems(updateItems) {
    return this.http.put(AuthItemContributorUrl.editMultipleItemsUrl, updateItems, this.accessTokenService.getAccessToken());
  }
  removeItemsPermanantly(obj) {
    return this.http.put(AuthItemContributorUrl.removeItemsPermanantlyUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeItemType(obj){
    return this.http.put(AuthItemContributorUrl.removeItemTypeUrl, obj, this.accessTokenService.getAccessToken());
  }
  uploadItems(obj) {
    return this.http.put(AuthItemContributorUrl.uploadItemsUrl, obj, this.accessTokenService.getAccessToken());
  }
  editProfileImage(obj) {
    return this.http.put(AuthItemContributorUrl.editProfileImageUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  editDescriptionImage(obj) {
    return this.http.put(AuthItemContributorUrl.editDescriptionImageUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  editItemTypeImage(obj) {
    return this.http.put(AuthItemContributorUrl.editItemTypeImageUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  editProfileImageIndex(obj) {
    return this.http.put(AuthItemContributorUrl.editProfileImageIndexUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  removeProfileImage(obj) {
    return this.http.put(AuthItemContributorUrl.removeProfileImageUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  removeDescriptionImage(obj) {
    return this.http.put(AuthItemContributorUrl.removeDescriptionImageUrl + '/' + obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
  removeImage(obj) {
    return this.http.put(AuthItemContributorUrl.removeItemTypeImageUrl + '/'+  obj.itemId, obj, this.accessTokenService.getAccessToken());
  }
}
