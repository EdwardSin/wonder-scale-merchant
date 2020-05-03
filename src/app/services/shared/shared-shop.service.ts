import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedShopService {

  shop: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  shop_id: string = '';
  shop_name: string = '';
  shop_username: string = '';
  currency: string = '';

  activeShopList: Subject<any[]> = new Subject<any[]>();
  pendingShopList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);



  contributorRefresh: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  refreshContributor: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  refresh: Subject<Boolean> = new Subject;
  recruitmentRefresh: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  items: Subject<any> = new BehaviorSubject<any>(null);
  payments: Subject<any> = new BehaviorSubject<any>([]);
  quotations: Subject<any> = new BehaviorSubject<any>([]);
  promotions: Subject<any> = new BehaviorSubject<any>([]);
  constructor() { }
}
