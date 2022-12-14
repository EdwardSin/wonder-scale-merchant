import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthCategoryContributorUrl } from '@enum/url.enum';
import { Category } from '@objects/category';
import { AccessTokenService } from '@services/http/auth-store/access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCategoryContributorService {


  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getCategoryByNameAndStoreId(name) {
    return this.http.post<Category>(AuthCategoryContributorUrl.getCategoryByNameAndStoreIdUrl, {name}, this.accessTokenService.getAccessToken());
  }
  addCategory(obj) {
    return this.http.post(AuthCategoryContributorUrl.addCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  editCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.editCategoryUrl + '/' + obj.category_id, obj, this.accessTokenService.getAccessToken());
  }
  getAuthenticatedCategoriesByStoreId() {
    return this.http.get<Category[]>(AuthCategoryContributorUrl.getAuthenticatedCategoriesByStoreIdUrl, this.accessTokenService.getAccessToken());
  }
  addItemsToCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.addItemsToCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeItemsFromCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.removeItemsFromCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  moveCategory(obj) {
    return this.http.put(AuthCategoryContributorUrl.moveCategoryUrl, obj, this.accessTokenService.getAccessToken());
  }
  rearrangeCategories(obj) {
    return this.http.put(AuthCategoryContributorUrl.rearrangeCategoriesUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeCategories(categories) {
    return this.http.put(AuthCategoryContributorUrl.removeCategoriesUrl, categories, this.accessTokenService.getAccessToken());
  }
  getNumberOfAllCategoriesItems() {
    return this.http.get(AuthCategoryContributorUrl.getNumberOfAllCategoriesItemsUrl, this.accessTokenService.getAccessToken());
  }
}
