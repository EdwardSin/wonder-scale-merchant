import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, timer, combineLatest } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-discount-items',
  templateUrl: './discount-items.component.html',
  styleUrls: ['./discount-items.component.scss']
})
export class DiscountItemsComponent implements OnInit {
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  numberOfDiscountItems = 0;
  loading: WsLoading = new WsLoading;
  environment = environment;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private authItemContributorService: AuthItemContributorService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Discount | ' + shop_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
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
  }

  getAllDiscountItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    combineLatest(timer(500), this.authItemContributorService.getAuthenticatedDiscountItemsByShopId({ keyword, page, order, orderBy }))
      .pipe(takeUntil(this.ngUnsubscribe),
        map(x => x[1]),
        finalize(() => { this.loading.stop(); }))
      .subscribe(result => {
        this.displayItems = result.result;
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
