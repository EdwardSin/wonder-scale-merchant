import { Component, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { Package } from '@objects/package';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscription;
  username;
  package: Package;
  loading: WsLoading = new WsLoading;
  changePackageLoading: WsLoading = new WsLoading;
  selectedProduct;
  unsubscribeLoading: WsLoading = new WsLoading;
  isSubscriptionOpened: boolean;
  isUnsubscribedProductConfirmationOpenend: boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService,
    private authPackageAdminService: AuthPackageAdminService) { 
  } 
    ngOnInit() {
      let shop_name = this.sharedShopService.shop_name;
      this.username = this.sharedShopService.shop_username;
      DocumentHelper.setWindowTitleWithWonderScale('Subscription - ' + shop_name);
      this.getShopPackage();
  }
  getShopPackage() {
    this.loading.start();
    this.authPackageAdminService.getShopPackages().pipe(takeUntil(this.ngUnsubscribe)).
    subscribe(result => {
      this.package = result['result'];
      if (this.package.next) {
        this.subscription = this.package.next;
      }
      this.loading.stop();
    })
  }
  changePackage() {
    let obj = {
      nextPackage: this.subscription
    };
    this.changePackageLoading.start();
    // this.authPackageAdminService.changePackage(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.changePackageLoading.stop()})).subscribe(result => {
    //   if (result['result']) {
    //     this.getShopPackage();
    //     this.package.next = this.subscription;
    //     this.isSubscriptionOpened = false;
    //   }
    // });
  }
  unsubscribe() {
    let obj = {
      _id: this.selectedProduct._id
    };
    this.unsubscribeLoading.start();
    // this.authPackageAdminService.unsubscribeProduct(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.unsubscribeLoading.stop()})).subscribe(result => {
    //   if (result['result']) {
    //     this.getShopPackage();
    //     this.selectedProduct.subscribe = false;
    //     this.isUnsubscribedProductConfirmationOpenend = false;
    //   }
    // });
  }
  isExpired(product) {
    return product.expiryDate <= new Date();
  }
  openUnsubscribe(product) {
    this.isUnsubscribedProductConfirmationOpenend = true;
    this.selectedProduct = product;
  }
  get nextTotal() { 
    let total = 0;
    if (!this.package.forfeit) {
      switch (this.package.next) {
        case 'monthly':
          total += 18.80; break;
        case '6-month':
          total += 100.80; break;
        case 'yearly':
          total += 177.60; break;
      }
    }
    total += _.sumBy(this.package.products, function (product) {
      if (product && product.subscribe) {
        return product.price;
      }
      return 0;
    });
    return total;
  }
}
