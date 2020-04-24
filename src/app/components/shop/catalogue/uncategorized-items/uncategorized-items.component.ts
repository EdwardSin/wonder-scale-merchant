import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-uncategorized-items',
  templateUrl: './uncategorized-items.component.html',
  styleUrls: ['./uncategorized-items.component.scss']
})
export class UncategorizedItemsComponent implements OnInit {
  shop_id: String;
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  loading: WsLoading = new WsLoading;
  numberOfUncategorizedItems = 0;
  queryParams = {page: 1, keyword: '', order: '', orderBy: 'asc'};
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
    DocumentHelper.setWindowTitleWithWonderScale('Uncategorized | ' + shop_name);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(queryParam => {
      this.queryParams = {keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by']};
      this.getUncategorizedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.uncategorizedItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.getUncategorizedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.numberOfUncategorizedItems.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.numberOfUncategorizedItems = res;
    })
  }
  getUncategorizedItems(keyword='', page=1, order='alphabet', orderBy) {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedUncategorizedItemCategoryByShopId({keyword, page, order, orderBy}).pipe(takeUntil(this.ngUnsubscribe))
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
