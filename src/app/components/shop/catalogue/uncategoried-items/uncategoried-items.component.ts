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

@Component({
  selector: 'app-uncategoried-items',
  templateUrl: './uncategoried-items.component.html',
  styleUrls: ['./uncategoried-items.component.scss']
})
export class UncategoriedItemsComponent implements OnInit {
  shop_id: String;
  allItems: Item[] = [];
  editItemList: Item[] = [];
  displayItems: Item[] = [];
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
    DocumentHelper.setWindowTitleWithWonderScale('Uncategoried | ' + shop_name);
    this.sharedCategoryService.uncategoriedItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.getUncategoriedItems();
      })
  }

  getUncategoriedItems() {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedUncategoriedItemCategoryByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.allItems = result.result;
        this.displayItems = result.result;
        this.sharedCategoryService.numberOfUncategoriedItems.next(this.allItems.length);
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
