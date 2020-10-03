import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Receipt } from '@objects/receipt';
import { AuthReceiptContributorService } from '@services/http/auth-shop/contributor/auth-receipt-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { CurrencyService } from '@services/http/general/currency.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  shop;
  currency: string = '';
  receipts: Receipt[] = [];
  loading: WsLoading = new WsLoading;
  receiptClick = [];
  @ViewChild('printContent', { static: true }) printContent: ElementRef;

  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private currencyService: CurrencyService, 
    private sharedShopService: SharedShopService,
    private authReceiptContributorService: AuthReceiptContributorService) { }

  ngOnInit() {
    this.loading.start();
    this.shop = this.sharedShopService.shop.getValue();
    let shop_name = this.sharedShopService.shop_name;
    this.currency = this.currencyService.currencySymbols[this.shop.currency];
    DocumentHelper.setWindowTitleWithWonderScale('History - ' + shop_name);
    this.getHistory();
  }
  getHistory() {
    this.authReceiptContributorService.getAllReceiptsByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.receipts = result.result;
        this.loading.stop();
      }, error => {
        this.loading.stop();
      })
  }
  reprint(receipt: Receipt) {
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(this.printContent.nativeElement.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
