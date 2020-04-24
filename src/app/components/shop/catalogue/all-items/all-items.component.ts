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
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.scss']
})
export class AllItemsComponent implements OnInit {
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  loading: WsLoading = new WsLoading;
  environment = environment;
  queryParams = {page: 1, keyword: '', order: '', orderBy: 'asc'};
  numberOfAllItems = 0;
  shop_id: String;
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
    DocumentHelper.setWindowTitleWithWonderScale('All | ' + shop_name);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(queryParam => {
      this.queryParams = {keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by']};
      this.getAllItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.allItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.getAllItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
      })
    this.sharedCategoryService.numberOfAllItems.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.numberOfAllItems = res;
    })
  }
  getAllItems(keyword='', page=1, order='alphabet', orderBy) {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedAllItemsByShopId({keyword, page, order, orderBy}).pipe(takeUntil(this.ngUnsubscribe))
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
