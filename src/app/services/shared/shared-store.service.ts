import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStoreService {

  store: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  store_id: string = '';
  store_name: string = '';
  storeUsername: string = '';
  currency: string = '';

  activeStoreList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  pendingStoreList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);



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
