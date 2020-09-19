import { Component, OnInit } from '@angular/core';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { SharedPackageService } from '@services/shared/shared-package.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  subscribingPackage;
  loading: WsLoading = new WsLoading;
  success;
  private ngUnsubscribe: Subject<any> = new Subject;
  selectedPackage;
  constructor(private authPackageAdminService: AuthPackageAdminService,
    private sharedPackageService: SharedPackageService) { 
      this.sharedPackageService.selectedPackage.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.selectedPackage = result;
      });
      this.sharedPackageService.subscribingPackage.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.subscribingPackage = result;
      })
  }

  ngOnInit(): void {
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
      case 'basic_6_month':
          return 'Basic package - 6 monthly'
      case 'basic_ordering_6_month':
          return 'Basic + Ordering package - 6 monthly'
      case 'basic_ecommerce_6_month':
          return 'Basic + eCommerce package - 6 monthly'
      case 'basic_ordering_ecommerce_6_month':
          return 'Basic + Ordering + eCommerce package - 6 monthly'
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
  subscribePackageCallback() {
    // subscribe current shop;
    this.success = true;
  }
  ngOnDestroy() {
    this.sharedPackageService.selectedPackage.next(null);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
