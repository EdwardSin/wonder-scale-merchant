import { Injectable } from '@angular/core';
import { CartItem } from '@objects/cartitem';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {

  cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  purchaseList: CartItem[] = [];
  advertisingPackageList: CartItem[] = [{
    amount: 100,
    description: '4 x Week Advertisement',
    credit: 4,
    type: 'advertising',
    currency: 'MYR'
  }, {
    amount: 180,
    description: '8 x Week Advertisement',
    credit: 8,
    type: 'advertising',
    currency: 'MYR'
  }, {
    amount: 260,
    description: '12 x Week Advertisement',
    credit: 12,
    type: 'advertising',
    currency: 'MYR'
  }, {
    amount: 320,
    description: '16 x Week Advertisement',
    credit: 16,
    type: 'advertising',
    currency: 'MYR'
  }]
  recruitmentServiceList: CartItem[] = [{
    description: '4 x Week Advertisement',
    amount: 50,
    credit: 4,
    type: 'recruitment',
    currency: 'MYR'
  }, {
    description: '8 x Week Advertisement',
    amount: 90,
    credit: 8,
    type: 'recruitment',
    currency: 'MYR'
  }, {
    description: '12 x Week Advertisement',
    amount: 130,
    credit: 12,
    type: 'recruitment',
    currency: 'MYR'
  }, {
    description: '16 x Week Advertisement',
    amount: 160,
    credit: 16,
    type: 'recruitment',
    currency: 'MYR'
  }];

  orderServiceList: CartItem[] = [{
    amount: 35,
    description: 'RM35/month',
    type: 'order',
    currency: 'MYR',
    credit: 1,
    subscribe: true
  }]
  ecommerceServiceList: CartItem[] = [{
    amount: 49,
    description: 'RM49/month',
    type: 'ecommerce',
    currency: 'MYR',
    credit: 1,
    subscribe: true
  }]
  quotationServiceList: CartItem[] = [{
    amount: 30,
    description: 'RM30/60 units',
    type: 'quotation',
    currency: 'MYR',
    credit: 60
  }]
  promotionFeatureList: CartItem[] = [{
    amount: 40,
    description: 'RM40/unit',
    type: 'promotion',
    currency: 'MYR',
    credit: 1
  }]

  constructor() { }


  checkPuchaseItem(item) {
    let list = this.purchaseList.filter(x => x.type == item.type);
    if (list.length) {
      let index = this.purchaseList.indexOf(list[0]);
      if (this.purchaseList[index] == item) {
        this.removeFromPurchaseList(item);
      }
      else {
        this.purchaseList[index] = item;
      }
    }
    else {
      this.purchaseList.push(item);
    }
    this.cartItems.next(this.purchaseList);
  }
  clearList() {
    this.purchaseList.length = 0;
    this.cartItems.next(this.purchaseList);
  }

  private removeFromPurchaseList(item) {
    _.remove(this.purchaseList, x => x == item);
  }

}
