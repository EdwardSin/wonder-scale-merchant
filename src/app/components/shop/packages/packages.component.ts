import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { SharedPackageService } from '@services/shared/shared-package.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Package } from '@objects/package';
import { HttpClient } from '@angular/common/http';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  subscribingPackage;
  shop_username: string;
  loading: WsLoading = new WsLoading;
  success;
  moment = moment;
  private ngUnsubscribe: Subject<any> = new Subject;
  selectedPackage;
  packages: Array<any> = [];
  isChangePackage: boolean;
  todayDate: Date = new Date;
  constructor(private http: HttpClient,
    private ref: ChangeDetectorRef ,
    private sharedShopService: SharedShopService,
    private authShopUserService: AuthShopUserService,
    private authPackageAdminService: AuthPackageAdminService,
    private sharedPackageService: SharedPackageService) { 
      this.shop_username = this.sharedShopService.shop_username;
      this.sharedPackageService.selectedPackage.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.selectedPackage = result;
      });
      this.sharedPackageService.subscribingPackage.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.subscribingPackage = result;
      })
      this.authShopUserService.getAuthenticatedShopByShopUsername(this.shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {});
  }

  ngOnInit(): void {
    this.http.get('assets/json/services.json').subscribe(result => {
      let packages = <Array<any>>result;
      this.packages = _.flattenDeep(packages.map(x => x.packages));
    });
  }
  navigateToChangePlan() {
    this.sharedPackageService.selectedPackage.next(null);
  }
  getPackageName(type) {
    switch(type) {
      case 'trial':
      case 'trial_6_months':
          return 'Trial - 6 months';
      case 'basic_monthly':
          return 'Basic package - monthly'
      case 'basic_ordering_monthly':
          return 'Basic + Ordering package - monthly'
      case 'basic_ecommerce_monthly':
          return 'Basic + eCommerce package - monthly'
      case 'basic_ordering_ecommerce_monthly':
          return 'Basic + Ordering + eCommerce package - monthly'
      case 'basic_6_months':
          return 'Basic package - 6 months'
      case 'basic_ordering_6_months':
          return 'Basic + Ordering package - 6 months'
      case 'basic_ecommerce_6_months':
          return 'Basic + eCommerce package - 6 months'
      case 'basic_ordering_ecommerce_6_months':
          return 'Basic + Ordering + eCommerce package - 6 months'
      case 'basic_yearly':
          return 'Basic package - yearly'
      case 'basic_ordering_yearly':
          return 'Basic + Ordering package - yearly'
      case 'basic_ecommerce_yearly':
          return 'Basic + eCommerce package - yearly'
      case 'basic_ordering_ecommerce_yearly':
          return 'Basic + Ordering + eCommerce package - yearly'
    }
  }
  subscribePackageCallback(callbackResult, callback) {
    let obj = {
      selectedPackage: this.selectedPackage,
      paymentMethod: {...callbackResult}
    }
    this.authPackageAdminService.changePackage(obj).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.authShopUserService.getAuthenticatedShopByShopUsername(this.shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.success = true;
        if (callback) {
          callback();
        }
      });
    })
  }
  changeNextMonthPackageCallback(callback) {
    this.authPackageAdminService.changePackage({selectedPackage: this.selectedPackage}).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.authShopUserService.getAuthenticatedShopByShopUsername(this.shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.success = true;
        if (callback) {
          callback();
        }
      });
    });
  }
  selectPackage() {
    this.selectedPackage = this.packages.find(x => x.type == this.subscribingPackage.next);
  }
  get getPackageIsExpired() {
    return moment(this.subscribingPackage.expiryDate).diff(moment(this.todayDate), 'days') < 0;
  }
  ngOnDestroy() {
    this.sharedPackageService.selectedPackage.next(null);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
