import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Receipt } from '@objects/receipt';
import { AuthReceiptContributorService } from '@services/http/auth-store/contributor/auth-receipt-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
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
  store;
  currency: string = '';
  receipts: Receipt[] = [];
  loading: WsLoading = new WsLoading;
  receiptClick = [];
  @ViewChild('printContent', { static: true }) printContent: ElementRef;

  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private currencyService: CurrencyService, 
    private sharedStoreService: SharedStoreService,
    private authReceiptContributorService: AuthReceiptContributorService) { }

  ngOnInit() {
    this.loading.start();
    this.store = this.sharedStoreService.store.getValue();
    let store_name = this.sharedStoreService.store_name;
    this.currency = this.currencyService.currencySymbols[this.store.currency];
    DocumentHelper.setWindowTitleWithWonderScale('History - ' + store_name);
    this.getHistory();
  }
  getHistory() {
    this.authReceiptContributorService.getAllReceiptsByStoreId().pipe(takeUntil(this.ngUnsubscribe))
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
