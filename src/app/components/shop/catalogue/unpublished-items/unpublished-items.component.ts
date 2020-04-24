import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
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
  selector: 'app-unpublished-items',
  templateUrl: './unpublished-items.component.html',
  styleUrls: ['./unpublished-items.component.scss']
})
export class UnpublishedItemsComponent implements OnInit {
  shop_id: String;
  editItemList: Array<any> = [];
  displayItems: Array<any> = [];
  numberOfUnpublishedItems = 0;
  queryParams = {page: 1, keyword: '', order: '', orderBy: 'asc'};
  loading: WsLoading = new WsLoading;
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
    DocumentHelper.setWindowTitleWithWonderScale('Unpublished | ' + shop_name);
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(queryParam => {
      this.queryParams = {keyword: queryParam['s_keyword'], page: queryParam['page'], order: queryParam['order'], orderBy: queryParam['by']};
      this.getUnpublishedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.unpublishedItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.getUnpublishedItems(this.queryParams.keyword, this.queryParams.page, this.queryParams.order, this.queryParams.orderBy);
    })
    this.sharedCategoryService.numberOfUnpublishedItems.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.numberOfUnpublishedItems = res;
    })
  }
  getUnpublishedItems(keyword='', page=1, order='alphabet', orderBy) {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedUnpublishedItemCategoryByShopId({keyword, page, order, orderBy}).pipe(takeUntil(this.ngUnsubscribe))
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
