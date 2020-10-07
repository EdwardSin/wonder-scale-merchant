import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Store } from '@objects/store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreResolver implements Resolve<Store>{
    constructor(private sharedStoreService: SharedStoreService, private authStoreUserService: AuthStoreUserService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Store> | Promise<Store> | Store {
        let username = route.params.username || this.sharedStoreService.store_username;
        if (route.params.username) {
            this.sharedStoreService.store_username = route.params.username;
        }
        return this.authStoreUserService.getAuthenticatedStoreByStoreUsername(username);
    }
}