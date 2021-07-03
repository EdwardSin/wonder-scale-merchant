import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Category } from '@objects/category';
import { Item } from '@objects/item';
import { AuthOnSellingCategoryContributorService } from '@services/http/auth-store/contributor/auth-on-selling-category-contributor.service';
import { AuthOnSellingItemContributorService } from '@services/http/auth-store/contributor/auth-on-selling-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
// import { saveAs } from 'file-saver';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil, switchMap } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  displayItems: Item[] = [];
  categoryId: string = '';
  categoryName: string = '';
  loading: WsLoading = new WsLoading;
  displayBanner: boolean;
  categoryFound: boolean;
  selectedCategory;
  numberOfItems = 0;
  numberOfCurrentTotalItems = 0;
  isNavOpen: Boolean = false;
  editItems: Item[] = [];
  currentPage: number = 1;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  @ViewChild('importFile', { static: true }) importFile: ElementRef;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject();
  getItemsSubscription: Subscription = new Subscription;
  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private sharedStoreService: SharedStoreService,
    private sharedLoadingService: SharedLoadingService,
    private sharedItemService: SharedItemService,
    private sharedNavbarService: SharedNavbarService,
    private sharedCategoryService: SharedCategoryService,
    private authOnSellingItemContributorService: AuthOnSellingItemContributorService,
    private authOnSellingCategoryContributorService: AuthOnSellingCategoryContributorService) {
  }

  ngOnInit() {
    let store_name = this.sharedStoreService.store_name;
    this.categoryName = this.route.snapshot.params.name;
    DocumentHelper.setWindowTitleWithWonderScale(this.categoryName + ' - ' + store_name);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.categoryName = this.route.snapshot.params.name;
      this.sharedItemService.editItems.next([]);
      this.sharedCategoryService.numberOfCurrentTotalItems.next(0);
      DocumentHelper.setWindowTitleWithWonderScale(this.categoryName + ' - ' + store_name);
      this.sharedCategoryService.categoryRefresh.next({refresh: true, loading: true});
      this.sharedCategoryService.refreshCategories(() => {}, false, false);
    })
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.currentPage = queryParam['page'] || 1;
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
          this.getItemsSubscription.unsubscribe();
          if (this.selectedCategory) {
            this.getItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
          }
        }
      })
    this.sharedCategoryService.categoryRefresh.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.refresh) {
        this.getCategoryByNameAndStoreId(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, result.loading);
      }
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
  getCategoryByNameAndStoreId(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading=true) {
    if(isLoading) {
      this.loading.start();
      this.numberOfItems = 0;
      this.displayItems = [];
      this.sharedItemService.displayItems.next(this.displayItems);
    }
    this.authOnSellingCategoryContributorService.getCategoryByNameAndStoreId(this.categoryName)
      .pipe(switchMap((result) => {
        this.categoryFound = result ? true: false;
        this.displayBanner = false;
        this.selectedCategory = result;
        this.categoryId = this.selectedCategory._id;
        this.sharedCategoryService.category.next(result);
        if (result && result['items'].length) {
          this.numberOfItems = result['items'].length;
        }
        return this.authOnSellingItemContributorService.getItemsByCategoryId(this.categoryId, keyword, page, order, orderBy);
      }), 
      finalize(() => { this.loading.stop(); }),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.displayItems = result['result'];
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        this.sharedLoadingService.screenLoading.next({ loading: false });
        this.sharedCategoryService.categoryRefresh.next({refresh: false, loading: false});
      })
  }
  getItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
      this.displayBanner = false;
    }
    this.getItemsSubscription = this.authOnSellingItemContributorService.getItemsByCategoryId(this.categoryId, keyword, page, order, orderBy)
      .pipe(takeUntil(this.ngUnsubscribe),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result['result'];
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        // this.displayBanner = this.isBannerShow();
        this.sharedLoadingService.screenLoading.next({ loading: false });
        this.sharedCategoryService.categoryRefresh.next({refresh: false, loading: false});
      })
  }
  toastDownload() {
    WsToastService.toastSubject.next({ content: 'Template is downloading!' });
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
