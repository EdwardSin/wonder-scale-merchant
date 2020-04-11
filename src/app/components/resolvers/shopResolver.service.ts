import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { Shop } from '@objects/shop';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopResolver implements Resolve<Shop>{
    constructor(private sharedShopService: SharedShopService, private authShopUserService: AuthShopUserService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Shop> | Promise<Shop> | Shop {
        let username = route.params.username || this.sharedShopService.shop_username;
        if (route.params.username) {
            this.sharedShopService.shop_username = route.params.username;
        }
        return this.authShopUserService.getAuthenticatedShopByShopUsername(username);
    }
}