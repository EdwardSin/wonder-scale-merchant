import { Component, HostListener, OnInit } from '@angular/core';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShopAuthorizationService } from '@services/http/general/shop-authorization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthShopAdminService } from '@services/http/auth-shop/admin/auth-shop-admin.service';
import { WsModalService } from '@elements/ws-modal/ws-modal.service';

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
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: WsModalService,
    private authShopAdminService: AuthShopAdminService,
    private sharedShopService: SharedShopService,
    private shopAuthorizationService: ShopAuthorizationService,
    private sharedNavbarService: SharedNavbarService) { }

  ngOnInit() {
    this.shop = this.sharedShopService.shop.getValue();
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.shop = result;
      }
    })
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.isNavOpen = res;
    });
    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isAdminAuthorized = result;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileSize = ScreenHelper.isMobileSize();
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
    });
  }
  openModal(id, element=null) {
    this.modalService.open(id);
    this.modalService.setElement(id, element);
  }
}
