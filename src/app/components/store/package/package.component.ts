import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthPackageAdminService } from '@services/http/auth-store/admin/auth-package-admin.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  store;
  currentPackage = 'free';
  selectedPackage;
  isChangePackageModalOpened: boolean;
  changeLoading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    private authPackageService: AuthPackageAdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      if (this.store.package) {
        this.currentPackage = this.store.package.name;
      }
    });
  }
  onPackageClicked(event) {
    this.selectedPackage = event;
    this.isChangePackageModalOpened = true;
  }
  changeCallback() {
    this.changeLoading.start();
    this.authPackageService.changePackage(this.selectedPackage).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.changeLoading.stop();})).subscribe(result => {
      if (result) {
        this.store.package.name = this.selectedPackage;
        this.sharedStoreService.store.next(this.store);
        this.isChangePackageModalOpened = false;
        let packageName = 'Premium Package';
        if (this.selectedPackage == 'free') {
          packageName = 'Free Package';
        }
        WsToastService.toastSubject.next({ content: 'Successfully change package - ' + packageName, type: 'success'});
        let returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          _.delay(() => {
            this.router.navigateByUrl(returnUrl);
          }, 1000);
        }
      }
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
