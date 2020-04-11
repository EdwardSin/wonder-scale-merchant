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

@Component({
  selector: 'app-unpublish-items',
  templateUrl: './unpublish-items.component.html',
  styleUrls: ['./unpublish-items.component.scss']
})
export class UnpublishItemsComponent implements OnInit {
  shop_id: String;
  allItems: Array<any> = [];
  editItemList: Array<any> = [];
  displayItems: Array<any> = [];
  loading: WsLoading = new WsLoading;
  environment = environment;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private authItemContributorService: AuthItemContributorService,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService) {
  }

  ngOnInit() {
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('Unpublish | ' + shop_name);
    this.sharedCategoryService.unpublishItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.getUnpublishItems();
      })
  }
  getUnpublishItems() {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedUnpublishItemCategoryByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.allItems = result.result;
        this.displayItems = result.result;
        this.sharedCategoryService.numberOfUnpublishItems.next(this.allItems.length);
        this.sharedItemService.allItems.next(this.allItems);
        this.sharedItemService.displayItems.next(this.displayItems);
        this.loading.stop();
      })
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
