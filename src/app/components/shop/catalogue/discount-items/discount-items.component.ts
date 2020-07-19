import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, timer, combineLatest, Subscription } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';

@Component({
  selector: 'app-discount-items',
  templateUrl: './discount-items.component.html',
  styleUrls: ['./discount-items.component.scss']
})
export class DiscountItemsComponent implements OnInit {
  displayItems: Item[] = [];
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  numberOfDiscountItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  editItems: Item[] = [];
  currentPage: number = 1;
  loading: WsLoading = new WsLoading;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject();
  getDiscountItemsSubscription: Subscription = new Subscription;
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private sharedItemService: SharedItemService,
    private sharedNavbarService: SharedNavbarService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private authItemContributorService: AuthItemContributorService) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    this.sharedItemService.editItems.next([]);
    this.sharedCategoryService.numberOfCurrentTotalItems.next(0);
    DocumentHelper.setWindowTitleWithWonderScale('Discount - ' + shop_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.currentPage = queryParam['page'] || 1;
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
          this.getDiscountItemsSubscription.unsubscribe();
          this.getAllDiscountItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
        }
      })
    this.sharedCategoryService.discountItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.getAllDiscountItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, false);
        }
      })
    this.sharedCategoryService.numberOfDiscountItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfDiscountItems = res;
      })
    this.sharedCategoryService.numberOfCurrentTotalItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfCurrentTotalItems = res;
        this.ref.detectChanges();
      })
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.isNavOpen = res;
        this.ref.detectChanges();
      });
    this.sharedItemService.editItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.editItems = res;
          this.ref.detectChanges();
        }
      })
  }

  getAllDiscountItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    this.getDiscountItemsSubscription = combineLatest(timer(500), this.authItemContributorService.getAuthenticatedDiscountItemsByShopId({ keyword, page, order, orderBy }))
      .pipe(takeUntil(this.ngUnsubscribe),
        map(x => x[1]),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result.result;
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        this.sharedCategoryService.numberOfDiscountItems.next(result['total']);
      })
  }
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }
  deselectAll() {
    this.sharedItemService.deselectAll();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
