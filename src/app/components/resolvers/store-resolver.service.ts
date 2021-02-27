import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Store } from '@objects/store';
import { Observable } from 'rxjs';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';

@Injectable({ providedIn: 'root' })
export class StoreResolver implements Resolve<Store>{
    constructor(private sharedStoreService: SharedStoreService, private authStoreContributorService: AuthStoreContributorService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Store> | Promise<Store> | Store {
        let username = route.params.username || this.sharedStoreService.storeUsername;
        if (route.params.username) {
            this.sharedStoreService.storeUsername = route.params.username;
        }
        return this.authStoreContributorService.getStoreByUsername(username);
    }
}