import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Package } from '@objects/package';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedPackageService } from '@services/shared/shared-package.service';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';
import * as moment from 'moment';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  @Input() subscribingPackage: Package;
  @Input() loading: boolean;
  @Input() isNavigateToShopPage: boolean;
  @Input() canTrial: boolean;
  selectedPackage: string;
  packageLoading: WsLoading = new WsLoading;
  packages = [];
  products;
  monthlyPackage;
  sixMonthsPackage;
  yearlyPackage;
  packagesLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private sharedPackageService: SharedPackageService,
    private router: Router) { }

  ngOnInit(): void {
    this.packagesLoading.start();
    this.http.get('assets/json/services.json').subscribe(result => {
      this.packages = <Array<any>>result;
      this.monthlyPackage = this.packages[0];
      this.sixMonthsPackage = this.packages[1];
      this.yearlyPackage = this.packages[2];
      this.packagesLoading.stop();
    });
  }
  selectPackage(_package) {
    this.authenticationService.isAuthenticated().then(result => {
      if (!_package) {
        _package = this.sharedPackageService.getTrialPackage();
      }
      this.sharedPackageService.selectedPackage.next(_package);
      if (this.isNavigateToShopPage) {
        if (result) {
          this.router.navigate(['/shops/all'], {queryParams:{modal: 'new-shop'}});
        } else {
          this.router.navigate([], {queryParams: {modal: 'login', returnUrl: '/shops/all?modal=new-shop'}});
        }
      }
    });
  }
  addOrderingPackage() {
    // this.authPackageAdminService.addShopPackage({name: 'ordering', price: 30, duration: 'monthly'}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {})).subscribe(result => {
    //   if (result && result['result']) {
    //     this.package.products.push('ordering');
    //     this.ref.detectChanges();
    //   }
    // });
  }
  isProductIncluded(type) {
    return this.products.find(product => {
      return product.name == type
    });
  }
  subscribeService(type) {
    if (type == 'ordering') {
      this.addOrderingPackage();
    }
  }
  get isExpired() {
    let todayDate = new Date;
    return this.subscribingPackage && moment(this.subscribingPackage.expiryDate).diff(moment(todayDate), 'days') < 0;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
