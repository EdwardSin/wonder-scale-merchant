import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthOnSellingItemContributorService } from '@services/http/auth-store/contributor/auth-on-selling-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, timer, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '@objects/item';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';

@Component({
  selector: 'app-new-items',
  templateUrl: './new-items.component.html',
  styleUrls: ['./new-items.component.scss']
})
export class NewItemsComponent implements OnInit {
  displayItems: Array<any> = [];
  loading: WsLoading = new WsLoading;
  numberOfNewItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  editItems: Item[] = [];
  currentPage: number = 1;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  environment = environment;

  private ngUnsubscribe: Subject<any> = new Subject();
  getNewItemsSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authOnSellingItemContributorService: AuthOnSellingItemContributorService,
    private sharedItemService: SharedItemService,
    private sharedNavbarService: SharedNavbarService,
    private sharedCategoryService: SharedCategoryService,
    private sharedStoreService: SharedStoreService) {
  }

  ngOnInit() {
    let store_name = this.sharedStoreService.store_name;
    this.sharedItemService.editItems.next([]);
    this.sharedCategoryService.numberOfCurrentTotalItems.next(0);
    this.sharedCategoryService.refreshCategories(() => {}, false, false);
    DocumentHelper.setWindowTitleWithWonderScale('New - ' + store_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.currentPage = queryParam['page'] || 1;
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
          this.getNewItemsSubscription.unsubscribe();
          this.getNewItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
        }
      })
    this.sharedCategoryService.newItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.getNewItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, false);
        }
      })
    this.sharedCategoryService.numberOfNewItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfNewItems = res;
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

  getNewItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    this.getNewItemsSubscription = this.authOnSellingItemContributorService.getAuthenticatedNewItemsByStoreId({ keyword, page, order, orderBy })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.displayItems = result['result'];
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
