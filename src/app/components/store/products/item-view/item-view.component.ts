import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { ViewType } from '@wstypes/view.type';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { ScreenService } from '@services/general/screen.service';
import * as _ from 'lodash';

@Component({
  selector: 'item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnInit {

  @Input() showCategory: boolean = false;
  param;
  store;
  selectedCurrencyCode;
  display: ViewType = 'list';
  isMobileSize: boolean;
  environment = environment;
  displayItems: Item[] = [];
  editItems: Item[] = [];
  columns: Array<string> = [];
  statusItems: Array<string> = [];
  total: number = 0;
  private ngUnsubscribe: Subject<any> = new Subject();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedStoreService: SharedStoreService,
    private ref: ChangeDetectorRef,
    private screenService: ScreenService,
    private sharedNavbarService: SharedNavbarService
  ) { 
  }

  ngOnInit() {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.param = this.route.snapshot['url'] && this.route.snapshot['url'][0] && this.route.snapshot['url'][0]['path'];
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.display = queryParams['display'] || 'list';
      this.ref.detectChanges();
    })
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if(result) {
        this.store = result;
      }
    });
    this.sharedItemService.displayItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.displayItems = res;
          this.display = this.route.snapshot.queryParams['display'] || 'list';
          this.ref.detectChanges();
        }
      })
    this.sharedCategoryService.numberOfCurrentTotalItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.total = res;
        this.ref.detectChanges();
      })
    this.sharedItemService.editItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.editItems = res;
          this.ref.detectChanges();
        }
      })
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    });
    this.sharedItemService.shownColumns.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.columns = result;
      this.ref.detectChanges();
    });
    this.sharedItemService.shownStatusItems.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.statusItems = result;
      this.ref.detectChanges();
    });
  }
  selectItems() {
    this.sharedItemService.selectItems();
  }
  deselectItems() {
    this.sharedItemService.deselectItems();
  }
  addToItemList(item) {
    this.sharedItemService.addToItemList(item);
  }
  isAllInclude(){
    let items = this.editItems.filter(item => this.displayItems.find(_item => _item._id == item._id));
    return items.length == this.displayItems.length;
  }
  triggerStatusItem(value) {
    if (this.statusItems.includes(value)) {
      this.statusItems = this.statusItems.filter(x => x != value);
    } else {
      this.statusItems.push(value);
    }
    sessionStorage.setItem('shownStatusItems', JSON.stringify(this.statusItems));
    this.sharedItemService.shownStatusItems.next(this.statusItems);
  }

  isInclude(it) {
    return this.editItems.findIndex(x => it._id === x['_id']) > -1;
  }
  trackByFn(index, item) {
    return index;
  }
  totalNoImages(item) {
    let profileImages = item.profileImages || [];
    let descriptionImages = item.descriptionImages || [];
    let noOfItemTypeImages = 0;
    if (item.types && item.types.length) {
      noOfItemTypeImages = _.sumBy(item.types, function (type) {
        let images = type.images || [];
        return images.length;
      });
    }
    return profileImages.length + descriptionImages.length + noOfItemTypeImages;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
