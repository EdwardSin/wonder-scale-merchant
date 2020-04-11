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
  selector: 'app-publish-items',
  templateUrl: './publish-items.component.html',
  styleUrls: ['./publish-items.component.scss']
})
export class PublishItemsComponent implements OnInit {
  allItems: Item[] = [];
  editItemList: Item[] = [];
  displayItems: Item[] = [];
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
    DocumentHelper.setWindowTitleWithWonderScale('Publish | ' + shop_name);
    this.sharedCategoryService.publishItemsRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.getPublishItems();

      })
  }

  getPublishItems() {
    this.loading.start();
    this.authItemContributorService.getAuthenticatedPublishItemCategoryByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.allItems = result.result;
        this.displayItems = result.result;
        this.sharedCategoryService.numberOfPublishItems.next(this.allItems.length);
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
