import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Category } from '@objects/category';
import { Item } from '@objects/item';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { CurrencyService } from '@services/http/general/currency.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { ArrayHelper } from '@helpers/arrayhelper/array.helper';
import { PriceHelper } from '@helpers/pricehelper/price.helper';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
// import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';
// import * as XLSX from 'xlsx';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  allItems: Item[] = [];
  displayItems: Item[] = [];
  editItemList: Item[] = [];
  category_id: string = '';
  category_name: string = '';
  loading: WsLoading = new WsLoading;
  displayBanner: boolean;
  categoryFound: boolean;
  selectedCategory: Category;
  @ViewChild('importFile', { static: true }) importFile: ElementRef;
  environment = environment;

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(
    private currencyService: CurrencyService,
    private sharedShopService: SharedShopService,
    private sharedLoadingService: SharedLoadingService,
    private modalService: WsModalService,
    private sharedItemService: SharedItemService,
    private sharedCategoryService: SharedCategoryService,
    private authShopContributorService: AuthShopContributorService,
    private authItemContributorService: AuthItemContributorService,
    private authCategoryContributorService: AuthCategoryContributorService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
    let shop_name = this.sharedShopService.shop_name;
    this.router.events.pipe(takeUntil(this.ngUnsubscribe), filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.category_name = this.route.snapshot.params.name;
        DocumentHelper.setWindowTitleWithWonderScale(this.category_name + ' | ' + shop_name);
        this.sharedCategoryService.categoryRefresh.next(true);
      })
  }

  ngOnInit() {
    this.loading.start();
    let shop_name = this.sharedShopService.shop_name;
    this.category_name = this.route.snapshot.params.name;
    DocumentHelper.setWindowTitleWithWonderScale(this.category_name + ' | ' + shop_name);
    this.sharedCategoryService.categoryRefresh.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getCategoryByNameAndShopId();
      }
    })
  }
  getCategoryByNameAndShopId() {
    this.authCategoryContributorService.getCategoryByNameAndShopId(this.category_name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.selectedCategory = result;
        this.sharedShopService.selectedCategory.next(result);
        this.category_id = this.selectedCategory._id;
        this.getItems();
      })
  }
  getItems() {
    this.displayBanner = false;
    this.loading.start();
    this.categoryFound = false;
    this.authItemContributorService.getItemsByCategoryId(this.category_id)
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
        this.categoryFound = true;
        this.allItems = result['result'];
        this.displayItems = result['result'];
        this.sharedItemService.allItems.next(this.allItems);
        this.sharedItemService.displayItems.next(this.displayItems);

        this.ref.detectChanges();
        PriceHelper.getDisplayPrice(this.allItems, PriceHelper.currencies, PriceHelper.rate);
        PriceHelper.getDisplayPrice(this.displayItems, PriceHelper.currencies, PriceHelper.rate);
        ArrayHelper.clear(this.editItemList);
        this.displayBanner = this.isBannerShow();
        this.sharedLoadingService.screenLoading.next(false);
        this.sharedCategoryService.categoryRefresh.next(false);
      })
  }
  importFileChangeEvent(event) {
    this.modalService.open('importItemsModal');
    event.category_id = this.category_id;
    this.modalService.setElement('importItemsModal', event);
    this.importFile.nativeElement.value = '';
  }

  isBannerShow() {
    return this.allItems.length > 0 && !this.isActiveItemFound(this.allItems);
  }

  isActiveItemFound(allItems) {
    return allItems.find(x => x.status == 'active');
  }
  openModal(id) {
    this.modalService.open(id);
  }
  toastDownload() {
    WsToastService.toastSubject.next({ content: 'Template is downloading!' });
  }
  export() {
    // let items = this.displayItems.map(item => {
    //   return {
    //     ID: item.refId,
    //     Name: item.name,
    //     Price: item.price,
    //     Quantity: item.quantity,
    //     'In-Stock': item.isInStock,
    //     Description: item.description
    //   }
    // })
    // let wb = XLSX.utils.book_new();
    // wb.SheetNames.push("Sheet1");
    // wb.Props = {
    //   Title: `${this.category_name} - Wonder Scale`,
    //   Author: 'Wonder Scale',
    //   CreatedDate: new Date
    // }
    // let ws = XLSX.utils.json_to_sheet(items);
    // wb.Sheets["Sheet1"] = ws;
    // let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // // saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
    // WsToastService.toastSubject.next({ content: 'File is downloading!' });

    // function s2ab(s) {
    //   var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    //   var view = new Uint8Array(buf);  //create uint8array as viewer
    //   for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    //   return buf;
    // }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
