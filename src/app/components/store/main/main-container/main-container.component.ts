import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { ScreenService } from '@services/general/screen.service';
import { environment } from '@environments/environment';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';

@Component({
  selector: 'main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  store;
  isNavOpen: boolean;
  isAdminAuthorized: boolean;
  isConfirmReactivateStoreModalOpened: boolean;
  isMobileSize: boolean;
  isClear: boolean = true;
  isCatalogueRoute: boolean;
  numberOfAllItems: number;
  environment = environment; 
  @ViewChild('alert', { static: true }) alert: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private sharedLoadingService: SharedLoadingService,
    private authStoreAdminService: AuthStoreAdminService,
    private sharedStoreService: SharedStoreService,
    private sharedCategoryService: SharedCategoryService,
    private storeAuthorizationService: StoreAuthorizationService,
    private sharedNavbarService: SharedNavbarService) { }

  ngOnInit() {
    this.store = this.sharedStoreService.store.getValue();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.store = result;
        this.isClear = false;
      }
    })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.isNavOpen = res;
    });
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isAdminAuthorized = result;
    });
    this.sharedCategoryService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfAllItems = result;
    })
    this.router.events.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isCatalogueRoute = this.router.url.includes('/products');
        }
    });
  }
  onNavbarOpen() {
    this.isNavOpen = !this.isNavOpen
    this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
  }
  reactivateFromInactive() {
    this.authStoreAdminService
    .reactivateStore()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.store.status.status = 'active';
      this.store.status.expiryDate = null;
      this.sharedStoreService.store.next(this.store);
      this.sharedLoadingService.screenLoading.next({loading: true});
      this.isConfirmReactivateStoreModalOpened = false;
    });
  }
  publishStore() {
    if (confirm('Are you sure to publish your store?')) {
      this.authStoreAdminService.publishStore().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.store.isPublished = true;
        this.sharedStoreService.store.next(this.store);
        WsToastService.toastSubject.next({content: result['message'], type: 'success'});
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
    }
  }
  closeAlert() {
    this.isClear = true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
