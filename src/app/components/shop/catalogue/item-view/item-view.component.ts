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
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedNavbarService } from '@services/shared/shared-nav-bar.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { Currency } from '@objects/currency';

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
  isNavOpen: Boolean = false;
  total: number = 0;
  currentPage: number = 1;

  private ngUnsubscribe: Subject<any> = new Subject();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private sharedShopService: SharedShopService,
    private ref: ChangeDetectorRef,
    private currencyService: CurrencyService,
    private modalService: WsModalService,
    private sharedNavbarService: SharedNavbarService
  ) { 
  }

  ngOnInit() {
    this.isMobileSize = ScreenHelper.isMobileSize();
    this.param = this.route.snapshot['url'] && this.route.snapshot['url'][0] && this.route.snapshot['url'][0]['path'];
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      this.display = queryParams['display'] || 'list';
      this.currentPage = queryParams['page'] || 1;
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
    this.sharedNavbarService.isNavSubject.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(res => {
      this.isNavOpen = res;
      this.ref.detectChanges();
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
  navigate(event) {
    this.router.navigate([], { queryParams: {page: event}, queryParamsHandling: 'merge' });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
