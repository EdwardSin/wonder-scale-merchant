import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, timer, Subscription } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';

@Component({
  selector: 'app-uncategorized-items',
  templateUrl: './uncategorized-items.component.html',
  styleUrls: ['./uncategorized-items.component.scss']
})
export class UncategorizedItemsComponent implements OnInit {
  shop_id: string;
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  loading: WsLoading = new WsLoading;
  numberOfUncategorizedItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  editItems: Item[] = [];
  currentPage: number = 1;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject();
  getUncategorizedItemsSubscription: Subscription = new Subscription;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authItemContributorService: AuthItemContributorService,
    private sharedItemService: SharedItemService,
    private sharedNavbarService: SharedNavbarService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    this.sharedItemService.editItems.next([]);
    this.sharedCategoryService.numberOfCurrentTotalItems.next(0);
    this.sharedCategoryService.refreshCategories(() => {}, false, false);
    DocumentHelper.setWindowTitleWithWonderScale('Uncategorized - ' + shop_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.currentPage = queryParam['page'] || 1;
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
          this.getUncategorizedItemsSubscription.unsubscribe();
          this.getUncategorizedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
        }
      })
    this.sharedCategoryService.uncategorizedItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.getUncategorizedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, false);
      })
    this.sharedCategoryService.numberOfUncategorizedItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfUncategorizedItems = res;
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
  getUncategorizedItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    this.getUncategorizedItemsSubscription = combineLatest(timer(500), this.authItemContributorService.getAuthenticatedUncategorizedItemCategoryByShopId({ keyword, page, order, orderBy }))
      .pipe(takeUntil(this.ngUnsubscribe),
        map(x => x[1]),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result.result;
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        this.loading.stop();
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
