import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { Package } from '@objects/package';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedPackageService } from '@services/shared/shared-package.service';

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
  monthlyPackage;
  sixMonthsPackage;
  yearlyPackage;
  packagesLoading: WsLoading = new WsLoading;
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
}
