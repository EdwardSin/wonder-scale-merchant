import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreAuthorizationService {
  isAdminAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }
}
