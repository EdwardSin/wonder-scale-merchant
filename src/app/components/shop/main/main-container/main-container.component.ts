import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShopAuthorizationService } from '@services/http/general/shop-authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthShopAdminService } from '@services/http/auth-shop/admin/auth-shop-admin.service';
import { ScreenService } from '@services/general/screen.service';
import { environment } from '@environments/environment';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  shop;
  isNavOpen: boolean;
  isAdminAuthorized: boolean;
  isConfirmReactivateShopModalOpened: boolean;
  isMobileSize: boolean;
  isClear: boolean = true;
  numberOfAllItems: number;
  environment = environment; 
  @ViewChild('alert', { static: true }) alert: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private screenService: ScreenService,
    private authShopAdminService: AuthShopAdminService,
    private sharedShopService: SharedShopService,
    private sharedCategoryService: SharedCategoryService,
    private shopAuthorizationService: ShopAuthorizationService,
    private sharedNavbarService: SharedNavbarService) { }

  ngOnInit() {
    this.shop = this.sharedShopService.shop.getValue();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.shop = result;
        this.isClear = false;
      }
    })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.isNavOpen = res;
    });
    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isAdminAuthorized = result;
    });
    this.sharedCategoryService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.numberOfAllItems = result;
    })
  }
  onNavbarOpen() {
    this.isNavOpen = !this.isNavOpen
    this.sharedNavbarService.isNavSubject.next(this.isNavOpen);
  }
  reactivateFromInactive() {
    this.authShopAdminService
    .reactivateShop()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.shop.status.status = 'active';
      this.shop.status.expiryDate = null;
      this.sharedShopService.shop.next(this.shop);
      this.isConfirmReactivateShopModalOpened = false;
    });
  }
  publishPage() {
    if (confirm('Are you sure to publish your page?')) {
      this.authShopAdminService.publishPage().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.shop.isPublished = true;
        this.sharedShopService.shop.next(this.shop);
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
