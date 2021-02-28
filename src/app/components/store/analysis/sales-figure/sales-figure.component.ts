import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import * as moment from 'moment';
import { Chart } from '@objects/chart';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-sales-figure',
  templateUrl: './sales-figure.component.html',
  styleUrls: ['./sales-figure.component.scss']
})
export class SalesFigureComponent implements OnInit {
  @ViewChild('monthlySales', { static: true }) monthlySales: ElementRef;
  updatedDate: Date = new Date;
  moment = moment;
  loading: WsLoading = new WsLoading;
  yearlySalesLoading: WsLoading = new WsLoading;
  salesLoading: WsLoading = new WsLoading;
  cumulativeLoading: WsLoading = new WsLoading;
  startHour: Date = new Date;
  endHour: Date = new Date;
  totalMonthlySales = 0;
  sales = {
    totalMonthlySales: 0,
    lastMonthSales: 0,
    averageMonthlySales: 0
  };
  last60MonthsDate = new Date;
  minDate = new Date;
  maxDate = new Date;
  fromDate = new Date;
  toDate = new Date;
  monthlySalesAnalysisSubscription;
  salesChart = Chart.createChart();
  yearlySalesChart = Chart.createChart();
  cumulativeChart = Chart.createChart();
  REFRESH_MONTHLY_SALES_INTERVAL = 30 * 60 * 1000;
  isMobileSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authAnalysisContributorService: AuthAnalysisContributorService,
    private screenService: ScreenService) { }

  ngOnInit(): void {
    this.setupData();
    this.salesChart.options.scales.yAxes[0].ticks.suggestedMax = 1000;
    this.yearlySalesChart.options.scales.yAxes[0].ticks.suggestedMax = 1000;
    this.cumulativeChart.options.scales.yAxes[0].ticks.suggestedMax = 1000;
    this.getMonthlySales();
    this.getYearlySales();
    this.getSalesBetweenDates();
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  setupData() {
    this.minDate = moment().add(-6, 'days').toDate();
    this.last60MonthsDate = moment().add(-6, 'months').toDate();
    this.fromDate = this.minDate;
    this.toDate = new Date;
  }
  getMonthlySales() {
    if (this.monthlySalesAnalysisSubscription) {
      this.monthlySalesAnalysisSubscription.unsubscribe();
    }
    this.monthlySalesAnalysisSubscription = timer(0, this.REFRESH_MONTHLY_SALES_INTERVAL).pipe(switchMap(() => this.authAnalysisContributorService.getMonthSalesAnalysis()),
      takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.sales = result['result'];
        this.authAnalysisContributorService.increment(this.monthlySales.nativeElement, 1000, this.sales.totalMonthlySales, true);
      });
  }
  getYearlySales() {
    this.yearlySalesLoading.start();
    this.cumulativeLoading.start();
    this.authAnalysisContributorService.getYearlySalesAnalysis().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.yearlySalesLoading.stop())).subscribe(result => {
      if (result['result']) {
        this.yearlySalesChart.data[0].data = [];
        result['result'].forEach(monthSale => {
          this.yearlySalesChart.data[0].data.push(monthSale.total)
        });
        this.yearlySalesChart.labels = result['result'].map(monthlySale => moment(monthlySale.date).format('MMM / YYYY'));
        this.getCumulativeSales(result['result']);
      }
    });
  }
  getSalesBetweenDates() {
    this.salesLoading.start();
    this.authAnalysisContributorService.getSalesBetweenDates(this.fromDate, this.toDate).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.salesLoading.stop())).subscribe(result => {
      if (result['result']) {
        let dateRange = this.getDateRange(this.fromDate, this.toDate);
        this.salesChart.data[0].data = [];
        dateRange.forEach(date => {
          let sale = result['result'].find(sale => sale.name == date);
          this.salesChart.data[0].data.push(sale ? sale.value : 0);
        });
        this.salesChart.labels = this.getDateRange(this.fromDate, this.toDate).map(date => moment(date).format('MM-DD (ddd)'));
      }
    });
  }
  getDateRange(fromDate, toDate) {
    let dateArray = [];
    let currentDate = moment(fromDate);
    let stopDate = moment(toDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }
  getCumulativeSales(sales) {
    let totals = sales.map(sale => sale.total);
    this.cumulativeChart.data[0].data = [];
    totals.reduce((accumulator, total) => {
      this.cumulativeChart.data[0].data.push(accumulator + total);
      return accumulator + total;
    }, 0);
    this.cumulativeChart.labels = sales.map(monthlySale => moment(monthlySale.date).format('MMM / YYYY'));
    this.cumulativeLoading.stop();
  }
  openCalendar() {
    this.maxDate = new Date();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
