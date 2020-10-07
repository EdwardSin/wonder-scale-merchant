import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStoreUserUrl } from '@enum/url.enum';
import { Store } from '@objects/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedStoreService } from '../../shared/shared-store.service';
import { CurrencyService } from '../general/currency.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreUserService {


  constructor(private http: HttpClient, private sharedStoreService: SharedStoreService, 
    private currencyService: CurrencyService) { }

  isAuthenticatedStoreByStoreUsername(username) {
    return this.http.get(AuthStoreUserUrl.isAuthenticatedStoreByStoreUsernameUrl + '/' + username);
  }
  getStoresByUserId(): Observable<any> {
    return this.http.get(AuthStoreUserUrl.getStoresByUserIdUrl)
      .pipe(tap(result => {
        this.sharedStoreService.activeStoreList.next(result['result'])
      })
      );
  }
  getAuthenticatedStoreByStoreUsername(username) {
    return this.http.get<Store>(AuthStoreUserUrl.getAuthenticatedStoreByStoreUsernameUrl + '/' + username)
      .pipe(tap(store => {
        this.currencyService.selectedCurrency.next(store['currency']);
        this.sharedStoreService.store.next(store);
      }));
  }
  getNotActiveStoresByUserId(): Observable<any> {
    return this.http.get(AuthStoreUserUrl.getNotActiveStoresByUserIdUrl);
  }
  getInvitationStoresByUserId(): Observable<any> {
    return this.http.get(AuthStoreUserUrl.getInvitationStoresByUserIdUrl).pipe(tap(result => {
      this.sharedStoreService.pendingStoreList.next(result['result']);
    }));
  }
  addStore(store) {
    let source = environment.SOURCE || 'website';
    return this.http.post(AuthStoreUserUrl.addStoreUrl, {...store, source});
  }
  addStoreWithSubscription(store) {
    let source = environment.SOURCE || 'website';
    return this.http.post(AuthStoreUserUrl.addStoreWithSubscriptionUrl, {...store, source});
  }
  getContributorRole(store, user) {
    return store.contributors.find(contributor => contributor.user == user._id);
  }
}
