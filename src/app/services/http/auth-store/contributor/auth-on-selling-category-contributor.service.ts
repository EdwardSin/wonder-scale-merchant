import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthOnSellingCategoryContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOnSellingCategoryContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }
  getCategoryByNameAndStoreId(name) {
    return this.http.post(AuthOnSellingCategoryContributorUrl.getCategoryByNameAndStoreIdUrl, {name}, this.accessTokenService.getAccessToken());
  }
  addCategory(obj) {
    return this.http.post(AuthOnSellingCategoryContributorUrl.addCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  editCategory(obj) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.editCategoryUrl + '/' + obj.category_id, obj, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedCategoriesByStoreId() {
    return this.http.get(AuthOnSellingCategoryContributorUrl.getAuthenticatedCategoriesByStoreIdUrl, this.accessTokenService.getAccessToken());
  }
  addItemsToCategory(obj) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.addItemsToCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeItemsFromCategory(obj) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.removeItemsFromCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  moveCategory(obj) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.moveCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  rearrangeCategories(obj) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.rearrangeCategoriesUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeCategories(categories) {
    return this.http.put(AuthOnSellingCategoryContributorUrl.removeCategoriesUrl, categories, this.accessTokenService.getAccessToken());
  }
}
