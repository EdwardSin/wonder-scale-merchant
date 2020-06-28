import { ChangeDetectorRef, Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject, interval, combineLatest, timer } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedUserService } from '@services/shared/shared-user.service';

@Component({
  selector: 'shop-list-controller',
  templateUrl: './shop-list-controller.component.html',
  styleUrls: ['./shop-list-controller.component.scss']
})
export class ShopListControllerComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject;
  user;
  activeShopList: Array<any> = [];
  pendingShopList: Array<any> = [];
  loading: WsLoading = new WsLoading;

  constructor(
    private route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private authShopUserService: AuthShopUserService,
    private sharedLoadingService: SharedLoadingService,
    private ref: ChangeDetectorRef,
    private sharedUserService: SharedUserService,
    private sharedShopService: SharedShopService) { }

  ngOnInit() {
    this.sharedLoadingService.loading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        result ? this.loading.start() : this.loading.stop();
        this.ref.detectChanges();
      })
    this.sharedShopService.refresh.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.getPendingShops();
      }
    });
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if (result) {
        this.user = result;
        this.getPendingShops();
      }
    })
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParams => {
        if (queryParams['modal']) {
          if (queryParams['modal'] == 'new-shop') {
            this.createLazyNewShopComponent();
          }
        } else {
          this.viewContainerRef.clear();
        }
      });
    this.intervalGetPendingShops();
  }
  getPendingShops() {
    this.sharedLoadingService.loading.next(this.loading.isRunning());
    combineLatest(timer(500),
    this.authShopUserService.getInvitationShopsByUserId())
    .pipe(
      map(x => x[1]),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.pendingShopList = result['result'];
        this.pendingShopList.forEach(shop => {
          shop.currentContributor = this.authShopUserService.getContributorRole(shop, this.user);
        })
        this.sharedShopService.pendingShopList.next(this.pendingShopList);
        this.loading.stop();
        this.sharedLoadingService.loading.next(this.loading.isRunning());
      })
  }
  async createLazyNewShopComponent() {
    this.viewContainerRef.clear();
    await import ('../../../modules/create-shop/create-shop.module');
    const { CreateShopComponent } = await import('@components/shop/create-shop/create-shop.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(CreateShopComponent));
  }
  intervalGetPendingShops() {
    interval(60 * 1000).pipe(switchMap(() => {return this.authShopUserService.getInvitationShopsByUserId()}),
    takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.pendingShopList = result['result'];
        this.pendingShopList.forEach(shop => {
          shop.currentContributor = this.authShopUserService.getContributorRole(shop, this.user);
        })
    });
  }
  refresh() {
    this.loading.start();
    this.sharedShopService.refresh.next(true);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
