import { Component, OnInit } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { AuthPackageAdminService } from '@services/http/auth-store/admin/auth-package-admin.service';
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
  constructor(private sharedStoreService: SharedStoreService,
    private authPackageAdminService: AuthPackageAdminService) { 
  } 
    ngOnInit() {
      let store_name = this.sharedStoreService.store_name;
      this.username = this.sharedStoreService.store_username;
      DocumentHelper.setWindowTitleWithWonderScale('Subscription - ' + store_name);
      this.getStorePackage();
  }
  getStorePackage() {
    this.loading.start();
    this.authPackageAdminService.getStorePackages().pipe(takeUntil(this.ngUnsubscribe)).
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
        this.getStorePackage();
        this.isUnsubscribedProductConfirmationOpenend = false;
        this.unsubscribeLoading.stop();
      }
    });
  }
  openUnsubscribe() {
    this.isUnsubscribedProductConfirmationOpenend = true;
  }
}
