import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShopAuthorizationService {
  isAdminAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }
}
