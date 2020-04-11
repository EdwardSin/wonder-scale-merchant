import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthCategoryContributorUrl } from '@enum/url.enum';
import { Category } from '@objects/category';
import { AccessTokenService } from '@services/http/auth-shop/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCategoryContributorService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getCategoryByNameAndShopId(name) {
    return this.http.get<Category>(AuthCategoryContributorUrl.getCategoryByNameAndShopIdUrl + `?name=${name}`, this.accessTokenService.getAccessToken());
  }
  addCategory(obj) {
    return this.http.post(AuthCategoryContributorUrl.addCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  editCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.editCategoryUrl + '/' + obj.category_id, obj, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedCategoriesByShopId() {
    return this.http.get<Category[]>(AuthCategoryContributorUrl.getAuthenticatedCategoriesByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  addItemsToCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.addItemsToCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeItemsFromCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.removeItemsFromCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  moveCategory(category_id, obj) {
    return this.http.put(AuthCategoryContributorUrl.moveCategoryUrl + '/' + category_id, obj, this.accessTokenService.getAccessToken());
  }
  rearrangeCategories(obj) {
    return this.http.put(AuthCategoryContributorUrl.rearrangeCategoriesUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeCategory(category_id) {
    return this.http.delete(AuthCategoryContributorUrl.removeCategoryUrl + '/' + category_id, this.accessTokenService.getAccessToken());
  }
  getNumberOfAllItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfAllItemsUrl, this.accessTokenService.getAccessToken());
  }
  getNumberOfNewItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfNewItemsUrl, this.accessTokenService.getAccessToken());
  }
  getNumberOfDiscountItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfDiscountItemsUrl, this.accessTokenService.getAccessToken());
  }
  getNumberOfPublishItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfPublishItemsUrl, this.accessTokenService.getAccessToken());
  }
  getNumberOfUnpublishItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfUnpublishItemsUrl, this.accessTokenService.getAccessToken());
  }
  getNumberOfUncategoriedItems() {
    return this.http.get<{ result: number }>(AuthCategoryContributorUrl.getNumberOfUncategoriedItemsUrl, this.accessTokenService.getAccessToken());
  }
}
