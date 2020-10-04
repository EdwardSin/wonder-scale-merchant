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
  subscribingPackage: Package;
  loading: WsLoading = new WsLoading;
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
      this.subscribingPackage = result['result'];
      if (this.subscribingPackage.next) {
        this.subscription = this.subscribingPackage.next;
      }
      this.loading.stop();
    })
  }
  unsubscribePackage() {
    this.unsubscribeLoading.start();
    let obj = {
      ...this.subscribingPackage
    }
    this.authPackageAdminService.unsubscribeProduct(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.getShopPackage();
        this.isUnsubscribedProductConfirmationOpenend = false;
        this.unsubscribeLoading.stop();
      }
    });
  }
  openUnsubscribe() {
    this.isUnsubscribedProductConfirmationOpenend = true;
  }
}
