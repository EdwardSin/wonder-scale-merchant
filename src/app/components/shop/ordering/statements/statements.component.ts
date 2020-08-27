import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthStatementAdminService } from '@services/http/auth-shop/admin/auth-statement-admin.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Cashier } from '@objects/cashier';
import * as _ from 'lodash';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {
  minDate = new Date;
  maxDate = new Date;
  fromDate = new Date;
  toDate = new Date;
  statements = [];
  cashier: Cashier;
  total: number;
  totalCommission: number;
  loading: WsLoading = new WsLoading;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authStatementAdminService: AuthStatementAdminService) { }

  ngOnInit(): void {
    this.setupDate();
    this.cashier = new Cashier();
    this.getStatements();
  }
  setupDate() {
    this.minDate = new Date;
    this.minDate.setDate(1);
    this.fromDate = this.minDate;
    this.toDate = new Date;
  }
  getStatements() {
    this.loading.start();
    let date = new Date;
    let _fromDate = new Date(date.getFullYear(), date.getMonth(), this.fromDate.getDate(), 0, 0, 0);
    let _toDate = new Date(date.getFullYear(), date.getMonth(), this.toDate.getDate() + 1, 0, 0, 0);
    let obj = {
      fromDate: _fromDate,
      toDate: _toDate
    };
    this.authStatementAdminService.getStatementsBetweenDate(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.statements = result['result'];
      // this.statements = this.statements.map(statement => {
      //   this.cashier.discount = statement.discount;
      //   this.cashier.tax = statement.tax;
      //   this.cashier.commission = 4;
      //   this.cashier.cartItems = statement.orders;
      //   return {
      //     ...statement,
      //     total: this.cashier.getSubtotal(),
      //     commission: this.cashier.getCommission()
      //   };
      // });
      // this.total = _.sumBy(this.statements, 'total');
      // this.totalCommission = _.sumBy(this.statements, 'commission');
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
