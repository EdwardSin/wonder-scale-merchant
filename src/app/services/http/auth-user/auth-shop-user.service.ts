import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthShopUserUrl } from '@enum/url.enum';
import { Shop } from '@objects/shop';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedShopService } from '../../shared/shared-shop.service';
import { SharedUserService } from '../../shared/shared-user.service';
import { CurrencyService } from '../general/currency.service';

@Injectable({
  providedIn: 'root'
})
export class AuthShopUserService {


  constructor(private http: HttpClient, private sharedShopService: SharedShopService, 
    private currencyService: CurrencyService) { }

  isAuthenticatedShopByShopUsername(username) {
    return this.http.get(AuthShopUserUrl.isAuthenticatedShopByShopUsernameUrl + '/' + username);
  }
  getShopsByUserId(): Observable<any> {
    return this.http.get(AuthShopUserUrl.getShopsByUserIdUrl)
      .pipe(tap(result => {
        this.sharedShopService.activeShopList.next(result['result'])
      })
      );
  }
  getAuthenticatedShopByShopUsername(username) {
    return this.http.get<Shop>(AuthShopUserUrl.getAuthenticatedShopByShopUsernameUrl + '/' + username)
      .pipe(tap(shop => {
        this.currencyService.selectedCurrency.next(shop['currency']);
        this.sharedShopService.shop.next(shop);
      }));
  }
  getNotActiveShopsByUserId(): Observable<any> {
    return this.http.get(AuthShopUserUrl.getNotActiveShopsByUserIdUrl);
  }
  getInvitationShopsByUserId(): Observable<any> {
    return this.http.get(AuthShopUserUrl.getInvitationShopsByUserIdUrl).pipe(tap(result => {
      this.sharedShopService.pendingShopList.next(result['result']);
    }));
  }
  addShop(shop) {
    return this.http.post(AuthShopUserUrl.addShopUrl, shop);
  }
  getContributorRole(shop, user) {
    return shop.contributors.find(contributor => contributor.user == user._id);
  }
}
