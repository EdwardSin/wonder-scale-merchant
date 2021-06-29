import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthOnSellingItemContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOnSellingItemContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getItemById(id: string){
    return this.http.get(AuthOnSellingItemContributorUrl.getItemById + '/' + id, this.accessTokenService.getAccessToken());
  }
  getItemsByCategoryId(id: string, keyword, page, order, orderBy) {
    return this.http.get(AuthOnSellingItemContributorUrl.getItemsByCategoryIdUrl + '/' + id, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        keyword,
        page,
        order,
        orderBy
      }
    });
  }
  getAuthenticatedAllItemsByStoreId(params) {
    return this.http.get(AuthOnSellingItemContributorUrl.getAuthenticatedAllItemsByStoreIdUrl, {
      ...this.accessTokenService.getAccessToken(),
      params
    });
  }
  getAuthenticatedNewItemsByStoreId(params) {
    return this.http.get(AuthOnSellingItemContributorUrl.getAuthenticatedNewItemsByStoreIdUrl,
      {
        ...this.accessTokenService.getAccessToken(),
        params
      });
  }
  saveItem(obj) {
    return this.http.post(AuthOnSellingItemContributorUrl.saveItemUrl, obj, this.accessTokenService.getAccessToken());  
  }
  markAsNew(items) {
    return this.http.put(AuthOnSellingItemContributorUrl.markAsNewUrl, { items }, this.accessTokenService.getAccessToken());
  }
  unmarkNew(items) {
    return this.http.put(AuthOnSellingItemContributorUrl.unmarkNewUrl, { items }, this.accessTokenService.getAccessToken());
  }
  editMultipleItems(updateItems) {
    return this.http.put(AuthOnSellingItemContributorUrl.editMultipleItemsUrl, updateItems, this.accessTokenService.getAccessToken());
  }
  removeItemsPermanantly(obj) {
    return this.http.put(AuthOnSellingItemContributorUrl.removeItemsPermanantlyUrl, obj, this.accessTokenService.getAccessToken());
  }
}
