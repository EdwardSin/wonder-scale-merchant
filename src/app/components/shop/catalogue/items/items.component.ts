import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Category } from '@objects/category';
import { Item } from '@objects/item';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
// import { saveAs } from 'file-saver';
import { Subject, combineLatest, timer, Subscription } from 'rxjs';
import { finalize, takeUntil, map, switchMap } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
// import * as XLSX from 'xlsx';

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
  selectedCategory: Category;
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
    private sharedShopService: SharedShopService,
    private sharedLoadingService: SharedLoadingService,
    private sharedItemService: SharedItemService,
    private sharedNavbarService: SharedNavbarService,
    private sharedCategoryService: SharedCategoryService,
    private authShopContributorService: AuthShopContributorService,
    private authItemContributorService: AuthItemContributorService,
    private authCategoryContributorService: AuthCategoryContributorService) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    this.categoryName = this.route.snapshot.params.name;
    DocumentHelper.setWindowTitleWithWonderScale(this.categoryName + ' - ' + shop_name);

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.categoryName = this.route.snapshot.params.name;
      this.sharedItemService.editItems.next([]);
      this.sharedCategoryService.numberOfCurrentTotalItems.next(0);
      DocumentHelper.setWindowTitleWithWonderScale(this.categoryName + ' - ' + shop_name);
      this.sharedCategoryService.categoryRefresh.next({refresh: true, loading: true});
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
        this.getCategoryByNameAndShopId(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, result.loading);
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
  getCategoryByNameAndShopId(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading=true) {
    if(isLoading) {
      this.loading.start();
      this.numberOfItems = 0;
      this.displayItems = [];
      this.sharedItemService.displayItems.next(this.displayItems);
    }
    combineLatest(timer(500), this.authCategoryContributorService.getCategoryByNameAndShopId(this.categoryName))
      .pipe(switchMap((result) => {
        this.categoryFound = result[1] ? true: false;
        this.displayBanner = false;
        this.selectedCategory = result[1];
        this.categoryId = this.selectedCategory._id;
        if (result && result[1] && result[1]['items'].length) {
          this.numberOfItems = result[1]['items'].length;
        }
        return this.authItemContributorService.getItemsByCategoryId(this.categoryId, keyword, page, order, orderBy);
      }), 
      finalize(() => { this.loading.stop(); }),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.displayItems = result['result'];
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        PriceHelper.getDisplayPrice(this.displayItems, PriceHelper.currencies, PriceHelper.rate);
        this.sharedLoadingService.screenLoading.next({ loading: false });
        this.sharedCategoryService.categoryRefresh.next({refresh: false, loading: false});
      })
  }
  getItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
      this.displayBanner = false;
    }
    this.getItemsSubscription = combineLatest(timer(500), this.authItemContributorService.getItemsByCategoryId(this.categoryId, keyword, page, order, orderBy))
      .pipe(takeUntil(this.ngUnsubscribe),
        map(x => x[1]),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result['result'];
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        PriceHelper.getDisplayPrice(this.displayItems, PriceHelper.currencies, PriceHelper.rate);
        // this.displayBanner = this.isBannerShow();
        this.sharedLoadingService.screenLoading.next({ loading: false });
        this.sharedCategoryService.categoryRefresh.next({refresh: false, loading: false});
      })
  }
  // importFileChangeEvent(event) {
  //   event.categoryId = this.categoryId;
  //   this.importFile.nativeElement.value = '';
  // }

  // isBannerShow() {
  //   return this.allItems.length > 0 && !this.isActiveItemFound(this.allItems);
  // }

  // isActiveItemFound(allItems) {
  //   return allItems.find(x => x.status == 'active');
  // }
  toastDownload() {
    WsToastService.toastSubject.next({ content: 'Template is downloading!' });
  }
  export() {
    // let items = this.displayItems.map(item => {
    //   return {
    //     ID: item.refId,
    //     Name: item.name,
    //     Price: item.price,
    //     Quantity: item.quantity,
    //     'In-Stock': item.isInStock,
    //     Description: item.description
    //   }
    // })
    // let wb = XLSX.utils.book_new();
    // wb.SheetNames.push("Sheet1");
    // wb.Props = {
    //   Title: `${this.categoryName} - Wonder Scale`,
    //   Author: 'Wonder Scale',
    //   CreatedDate: new Date
    // }
    // let ws = XLSX.utils.json_to_sheet(items);
    // wb.Sheets["Sheet1"] = ws;
    // let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // // saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
    // WsToastService.toastSubject.next({ content: 'File is downloading!' });

    // function s2ab(s) {
    //   var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    //   var view = new Uint8Array(buf);  //create uint8array as viewer
    //   for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    //   return buf;
    // }
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
