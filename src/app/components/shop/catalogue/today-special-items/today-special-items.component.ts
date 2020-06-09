import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject, combineLatest, timer } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-today-special-items',
  templateUrl: './today-special-items.component.html',
  styleUrls: ['./today-special-items.component.scss']
})
export class TodaySpecialItemsComponent implements OnInit {
  displayItems: Array<any> = [];
  loading: WsLoading = new WsLoading;
  numberOfTodaySpecialItems = 0;
  queryParams = { page: 1, keyword: '', order: '', orderBy: 'asc' };
  environment = environment;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private authItemContributorService: AuthItemContributorService,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Today Special - ' + shop_name);
    this.loading.start();
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        if (this.queryParams.keyword != queryParam.s_keyword || this.queryParams.page != queryParam.page || this.queryParams.order != queryParam.order || this.queryParams.orderBy != queryParam.by) {
          this.queryParams = { keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by'] };
          this.getTodaySpecialItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
        }
      })
    this.sharedCategoryService.todaySpecialItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.getTodaySpecialItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy, false);
        }
      })
    this.sharedCategoryService.numberOfTodaySpecialItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfTodaySpecialItems = res;
      })
  }

  getTodaySpecialItems(keyword = '', page = 1, order = 'alphabet', orderBy, isLoading = true) {
    if (isLoading) {
      this.loading.start();
    }
    combineLatest(timer(500),
      this.authItemContributorService.getAuthenticatedTodaySpecialItemsByShopId({ keyword, page, order, orderBy }))
      .pipe(map(x => x[1]),
        takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.displayItems = result.result;
        this.sharedItemService.displayItems.next(this.displayItems);
        this.sharedCategoryService.numberOfCurrentTotalItems.next(result['total']);
        this.loading.stop();
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
