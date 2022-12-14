import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { AuthItemContributorService } from '@services/http/auth-store/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, Subscription, timer } from 'rxjs';
import { takeUntil, finalize, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.scss']
})
export class AllItemsComponent implements OnInit {
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  loading: WsLoading = new WsLoading;
  environment = environment;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  numberOfAllItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  editItems: Item[] = [];
  currentPage: number = 1;
  private ngUnsubscribe: Subject<any> = new Subject();
  getAllItemsSubscribe: Subscription = new Subscription();
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authItemContributorService: AuthItemContributorService,
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
    DocumentHelper.setWindowTitleWithWonderScale('All - ' + store_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParam => {
      if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
        this.currentPage = queryParam['page'] || 1;
        this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
        this.getAllItemsSubscribe.unsubscribe();
        this.getAllItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
      }
    });

    this.sharedCategoryService.allItemsRefresh.pipe(takeUntil(this.ngUnsubscribe),
      finalize(() => this.sharedCategoryService.allItemsRefresh.next(false))).subscribe(res => {
        if (res) {
          this.getAllItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, false);
        }
      });

    this.sharedCategoryService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfAllItems = res;
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
  getAllItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    this.getAllItemsSubscribe = combineLatest(timer(500), this.authItemContributorService.getAuthenticatedAllItemsByStoreId({ keyword, page, order, orderBy }))
      .pipe(takeUntil(this.ngUnsubscribe),
        map(x => x[1]),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result['result'];
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        this.ref.detectChanges();
      });
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
