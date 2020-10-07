import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthSaleContributorService } from '@services/http/auth-store/ordering-contributor/auth-sale-contributor.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Cashier } from '@objects/cashier';
import * as _ from 'lodash';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  minDate = new Date;
  maxDate = new Date;
  fromDate = new Date;
  toDate = new Date;
  status: string = '';
  sales = [];
  cashier: Cashier;
  total: number;
  totalCommission: number;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authSaleContributorService: AuthSaleContributorService) { }

  ngOnInit(): void {
    this.setupDate();
    this.cashier = new Cashier();
    this.getSales();
  }
  setupDate() {
    this.minDate = new Date;
    this.minDate.setDate(1);
    this.fromDate = this.minDate;
    this.toDate = new Date;
  }
  getSales() {
    this.loading.start();
    let date = new Date;
    let _fromDate = new Date(date.getFullYear(), date.getMonth(), this.fromDate.getDate(), 0, 0, 0);
    let _toDate = new Date(date.getFullYear(), date.getMonth(), this.toDate.getDate() + 1, 0, 0, 0);
    let obj = {
      fromDate: _fromDate,
      toDate: _toDate,
      status: this.status
    };
    this.authSaleContributorService.getSalesBetweenDate(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.sales = result['result'];
      this.sales = this.sales.map(sale => {
        this.cashier.discount = sale.discount;
        this.cashier.tax = sale.tax;
        this.cashier.commission = 4;
        this.cashier.cartItems = sale.orders;
        return {
          ...sale,
          total: this.cashier.getSubtotal(),
          commission: this.cashier.getCommission()
        };
      });
      this.total = _.sumBy(this.sales, 'total');
      this.totalCommission = _.sumBy(this.sales, 'commission');
    });
  }
}
