import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import * as moment from 'moment';
import { Chart } from '@objects/chart';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-invoice-figure',
  templateUrl: './invoice-figure.component.html',
  styleUrls: ['./invoice-figure.component.scss']
})
export class InvoiceFigureComponent implements OnInit {
  @ViewChild('monthlyInvoice', { static: true }) monthlyInvoice: ElementRef;
  updatedDate: Date = new Date;
  moment = moment;
  loading: WsLoading = new WsLoading;
  invoiceLoading: WsLoading = new WsLoading;
  cumulativeLoading: WsLoading = new WsLoading;
  boardLoading: WsLoading = new WsLoading;
  startHour: Date = new Date;
  endHour: Date = new Date;
  totalMonthlyInvoice = 0;
  invoice = {
    totalMonthlyInvoice: 0,
    lastMonthInvoice: 0,
    averageMonthlyInvoice: 0
  };
  last60MonthsDate = new Date;
  minDate = new Date;
  maxDate = new Date;
  fromDate = new Date;
  toDate = new Date;
  monthlyInvoiceAnalysisSubscription;
  invoiceChart = Chart.createChart();
  cumulativeChart = Chart.createChart();
  REFRESH_MONTHLY_INVOICE_INTERVAL = 2 * 60 * 1000;
  isMobileSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authAnalysisContributorService: AuthAnalysisContributorService,
    private screenService: ScreenService) { 
      this.authAnalysisContributorService.refreshFunction.next(this.getMonthlyInvoice.bind(this));
  }

  ngOnInit(): void {
    this.setupData();
    this.refreshMonthlyInvoice();
    this.getYearlyInvoice();
    this.getInvoiceBetweenDates();
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
  getMonthlyInvoice() {
    this.boardLoading.start();
    this.authAnalysisContributorService.refreshLoading.next(this.boardLoading.isRunning());
    this.authAnalysisContributorService.getMonthInvoiceAnalysis().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => {
        this.boardLoading.stop();
        this.authAnalysisContributorService.refreshLoading.next(this.boardLoading.isRunning());
      })).subscribe(this.getMonthlyInvoiceCallback.bind(this));
  }
  refreshMonthlyInvoice() {
    if (this.monthlyInvoiceAnalysisSubscription) {
      this.monthlyInvoiceAnalysisSubscription.unsubscribe();
    }
    this.monthlyInvoiceAnalysisSubscription = timer(0, this.REFRESH_MONTHLY_INVOICE_INTERVAL).pipe(
      switchMap(() => this.authAnalysisContributorService.getMonthInvoiceAnalysis()),
      takeUntil(this.ngUnsubscribe)).subscribe(this.getMonthlyInvoiceCallback.bind(this));
  }
  getMonthlyInvoiceCallback(result) {
    this.invoice = result['result'];
    this.authAnalysisContributorService.increment(this.monthlyInvoice.nativeElement, 1000, this.invoice.totalMonthlyInvoice);
  }
  getYearlyInvoice() {
    this.cumulativeLoading.start();
    this.authAnalysisContributorService.getYearlyInvoiceAnalysis().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result']) {
        this.getCumulativeInvoice(result['result']);
      }
    });
  }
  getInvoiceBetweenDates() {
    this.invoiceLoading.start();
    this.authAnalysisContributorService.getInvoiceBetweenDates(this.fromDate, this.toDate).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.invoiceLoading.stop())).subscribe(result => {
      if (result['result']) {
        let dateRange = this.getDateRange(this.fromDate, this.toDate);
        this.invoiceChart.data[0].data = [];
        dateRange.forEach(date => {
          let invoice = result['result'].find(invoice => invoice.name == date);
          this.invoiceChart.data[0].data.push(invoice ? invoice.value : 0);
        });
        this.invoiceChart.labels = this.getDateRange(this.fromDate, this.toDate).map(date => moment(date).format('MM-DD (ddd)'));
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
  getCumulativeInvoice(invoice) {
    let total = 0;
    this.cumulativeChart.data[0].data = [];
    for(let index of Array(12).keys()) {
      let foundInvoice = invoice.find(_invoice => {
        return moment().subtract(12 - index, 'months').startOf('month').diff(moment(_invoice.date).startOf('month'), 'months', true) == 0;
      })
      if (foundInvoice) {
        total += foundInvoice.total;
      }
      this.cumulativeChart.data[0].data.push(total);
    }
    this.cumulativeChart.labels = [...Array(12).keys()].map(index => {
      return moment().subtract(12 - index, 'months').format('MMM / YYYY');
    });
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
