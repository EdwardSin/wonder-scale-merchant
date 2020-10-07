import { Injectable } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {

  constructor(private sharedStoreService: SharedStoreService) { }

  getAccessToken() {
    let store_id = this.sharedStoreService.store_id;
    return {
      headers: { "access-store": store_id }
    }
  }
}
