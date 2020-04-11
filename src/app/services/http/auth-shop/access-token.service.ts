import { Injectable } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(private sharedShopService: SharedShopService) { }

  getAccessToken() {
    let shop_id = this.sharedShopService.shop_id;
    return {
      headers: { "access-shop": shop_id }
    }
  }
}
