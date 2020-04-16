import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { Currency } from '@objects/currency';
import { CurrencyOption } from '@objects/currency.option';
import { Item } from '@objects/item';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { OrderHelper } from '@helpers/orderhelper/order.helper';
import { OrderType } from '@wstypes/order.type';
import { OrderingType } from '@wstypes/ordering.type';
import { ViewType } from '@wstypes/view.type';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { ScreenHelper } from '@helpers/screenhelper/screen.helper';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnInit {

  @Input() showCategory: boolean = false;
  order: OrderType = 'alphabet';
  orderBy: OrderingType;
  param;
  display: ViewType = 'list';
  isMobileSize: boolean;
  currencyOption: CurrencyOption = new CurrencyOption;
  environment = environment;
  Currency = Currency;
  allItems: Item[] = [];
  displayItems: Item[] = [];
  editItems: Item[] = [];

  private ngUnsubscribe: Subject<any> = new Subject();


  constructor(
    private route: ActivatedRoute,
    private sharedItemService: SharedItemService,
    private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef,
    private currencyService: CurrencyService,
    private modalService: WsModalService
  ) { }

  ngOnInit() {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.param = this.route.snapshot['url'] && this.route.snapshot['url'][0] && this.route.snapshot['url'][0]['path'];
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.display = queryParams['display'] || 'list';
      this.order = queryParams['order'] || 'alphabet';
      this.orderBy = queryParams['by'];
      this.displayItems = OrderHelper.orderByAndSetItemList(this.order, this.displayItems, this.orderBy);
      this.ref.detectChanges();
    })
    this.sharedItemService.allItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.allItems = res;
        }
      })
    this.sharedItemService.displayItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.displayItems = res;
          this.order = this.route.snapshot.queryParams['order'] || 'alphabet';
          this.orderBy = this.route.snapshot.queryParams['by'];
          this.display = this.route.snapshot.queryParams['display'] || 'list';
          PriceHelper.getDisplayPrice(this.displayItems, PriceHelper.currencies, PriceHelper.rate);
          this.displayItems = OrderHelper.orderByAndSetItemList(this.order, this.displayItems, this.orderBy);
          this.ref.detectChanges();
        }
      })
    this.sharedItemService.editItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.editItems = res;
          this.ref.detectChanges();
        }
      })
    this.currencyService.currencyRate
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.currencyOption.currencies = result;
          this.currencyService.selectedCurrency
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              if (result) {
                this.currencyOption.target_currency = result;
                this.currencyOption.symbol = this.currencyOption.currencySymbols[result];
                this.currencyOption.rate = this.currencyOption.currencies[result];
                this.ref.detectChanges();
              }
            });
          this.ref.detectChanges();
        }
      });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileSize = ScreenHelper.isMobileSize();
  }
  selectAll() {
    this.sharedItemService.selectAll();
  }
  deselectAll() {
    this.sharedItemService.deselectAll();
  }


  addToItemList(item) {
    this.sharedItemService.addToItemList(item);
  }

  isInclude(it) {
    return this.editItems.findIndex(x => it._id === x['_id']) > -1;
  }

  trackByFn(index, item) {
    return index;
  }

  openModal(id, item) {
    this.modalService.open(id);
    this.modalService.setElement(id, item);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
