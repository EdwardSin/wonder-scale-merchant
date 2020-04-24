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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-discount-items',
  templateUrl: './discount-items.component.html',
  styleUrls: ['./discount-items.component.scss']
})
export class DiscountItemsComponent implements OnInit {
  editItemList: Item[] = [];
  displayItems: Item[] = [];
  queryParams = {page: 1, keyword: '', order: '', orderBy: 'asc'};
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
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(queryParam => {
        this.queryParams = {keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by']};
        this.getAllDiscountItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.discountItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.getAllDiscountItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.numberOfDiscountItems.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.numberOfDiscountItems = res;
    })
  }

  getAllDiscountItems(keyword='', page=1, order='alphabet', orderBy) {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedDiscountItemsByShopId({keyword, page, order, orderBy}).pipe(takeUntil(this.ngUnsubscribe))
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
