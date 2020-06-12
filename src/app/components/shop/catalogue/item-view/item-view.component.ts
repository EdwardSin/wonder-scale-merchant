import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Item } from '@objects/item';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { ViewType } from '@wstypes/view.type';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { Currency } from '@objects/currency';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnInit {

  @Input() showCategory: boolean = false;
  param;
  shop;
  selectedCurrencyCode;
  currencySymbol;
  display: ViewType = 'list';
  isMobileSize: boolean;
  environment = environment;
  displayItems: Item[] = [];
  editItems: Item[] = [];
  columns: Array<string> = [];
  total: number = 0;
  private ngUnsubscribe: Subject<any> = new Subject();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef,
    private screenService: ScreenService,
    public currencyService: CurrencyService,
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
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      if(result) {
        this.shop = result;
        this.currencySymbol = this.currencyService.currencySymbols[this.shop.currency];
      }
    });
    this.sharedItemService.displayItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.displayItems = res;
          this.display = this.route.snapshot.queryParams['display'] || 'list';
          PriceHelper.getDisplayPrice(this.displayItems, PriceHelper.currencies, PriceHelper.rate);
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
    this.currencyService.currencyRate
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rates => {
        if (rates) {
          this.currencyService.currencyFullnameArray.forEach(key => {
            let currency = new Currency();
            currency.code = key;
            currency.rate = rates[key];
            currency.symbol = this.currencyService.currencySymbols[key];
            currency.fullname = this.currencyService.currencyFullnames[key];
            this.currencyService.currencies.push(currency);
          })
          this.ref.detectChanges();
        }
      });
    this.currencyService.selectedCurrency
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.selectedCurrencyCode = result;
    });
    
    this.sharedItemService.shownColumns.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.columns = result;
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

  isInclude(it) {
    return this.editItems.findIndex(x => it._id === x['_id']) > -1;
  }
  isOffer(item) {
    return item.isOffer && (item.discount > 0 || item.types.some(type => {
      return type.discount > 0;
    }));
  }
  trackByFn(index, item) {
    return index;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
