import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Sale } from '@objects/sale';
import * as moment from 'moment';
import { Moment } from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as XLSX from 'xlsx';
import _ from 'lodash';
import { ScreenService } from '@services/general/screen.service';
export const DAY_FORMATS = {
  parse: {
    dateInput: 'MMM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'export-sales-modal',
  templateUrl: './export-sales-modal.component.html',
  styleUrls: ['./export-sales-modal.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: DAY_FORMATS}
  ],
})
export class ExportSalesModalComponent extends WsModalComponent implements OnInit {
  sales: Array<Sale> = null;
  isPreview: boolean;
  minDate = new Date;
  maxDate = new Date;
  last60MonthsDate = new Date;
  isMobileSize: boolean;
  selectedType = new FormControl('month');
  fromDate = new FormControl(moment().date(1));
  toDate = new FormControl(moment());
  monthFromDate = new FormControl(moment().hour(0).minutes(0).seconds(0));
  monthToDate = new FormControl(moment().hour(0).minutes(0).seconds(0));
  yearDate = new FormControl(moment());
  exportLoading: WsLoading = new WsLoading();
  previewLoading: WsLoading = new WsLoading();
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private screenService: ScreenService, private authAnalysisContributorService: AuthAnalysisContributorService) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    this.minDate = moment().set('year', 2019).toDate();
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  close() {
    super.close();
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
  chosenDayHandler(normalizedDay: Moment, datepicker:MatDatepicker<Moment>, date) {
    const ctrlValue = date.value;
    ctrlValue.date(normalizedDay.date());
    ctrlValue.month(normalizedDay.month());
    ctrlValue.year(normalizedDay.year());
    date.setValue(ctrlValue);
    datepicker.close();
  }
  chosenMonthlySelectHandler(normalizedDay: Moment, datepicker: MatDatepicker<Moment>, isLast=false) {
    if (!isLast) {
      const monthFromCtrlValue = this.monthFromDate.value;
      monthFromCtrlValue.date(normalizedDay.date());
      monthFromCtrlValue.month(normalizedDay.month());
      monthFromCtrlValue.year(normalizedDay.year());
      this.monthFromDate.setValue(monthFromCtrlValue);
    }
    if (isLast) {
      const monthToCtrlValue = this.monthToDate.value;
      monthToCtrlValue.date(normalizedDay.date());
      monthToCtrlValue.month(normalizedDay.month());
      monthToCtrlValue.year(normalizedDay.year());
      this.monthToDate.setValue(monthToCtrlValue);
      this.monthToDate.setValue(monthToCtrlValue.endOf('month'));
    }
    datepicker.close();
  }
  chosenYearlySelectHandler(normalizedDay: Moment, datepicker: MatDatepicker<Moment>, date) {
    const ctrlValue = date.value;
    ctrlValue.day(1);
    ctrlValue.month(1);
    ctrlValue.year(normalizedDay.year());
    date.setValue(ctrlValue);
    datepicker.close();
  }
  openCalendar() {
    this.maxDate = new Date();
  }
  export() {
    switch(this.selectedType.value){
      case 'day':
        return this.getSales()
      case 'month':
        return this.getMonthlySales();
      case 'year':
        return this.getYearlySales();
    }
  }
  preview() {
    this.get100Sales();
  }
  getSales() {
    this.exportLoading.start();
    let startDate = this.fromDate.value.startOf('date').toDate();
    let endDate = this.toDate.value.endOf('date').toDate();
    this.authAnalysisContributorService.getSalesDetailsBetweenDates(startDate, endDate, false).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.exportLoading.stop())).subscribe(result => {
      this.renderDailySalesToXLSX(result['result']);
    });
  }
  getMonthlySales() {
    this.exportLoading.start();
    let startDate = this.monthFromDate.value.startOf('month').toDate();
    let endDate = this.monthToDate.value.endOf('month').toDate();
    this.authAnalysisContributorService.getMonthlySalesDetailsBetweenDates(startDate, endDate, false).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.exportLoading.stop())).subscribe(result => {
      if (result) {
        this.renderMonthlySalesToXLSX(result['result']);
      }
    });
  }
  getYearlySales() {
    this.exportLoading.start();
    let startDate = this.yearDate.value.date(1).month(0).hours(0).minutes(0).seconds(0).toDate();
    let endDate = this.yearDate.value.endOf("year").toDate();
    this.authAnalysisContributorService.getYearlySalesDetailsBetweenDates(startDate, endDate, false).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.exportLoading.stop())).subscribe(result => {
      if (result) {
        this.renderYearlySalesToXLSX(result['result']);
      }
    });
  }
  get100Sales() {
    this.isPreview = true;
    this.previewLoading.start();
    this.sales = [];
    this.authAnalysisContributorService.getSalesDetailsBetweenDates(this.fromDate.value.toDate(), this.toDate.value.toDate(), true).pipe(takeUntil(this.ngUnsubscribe))
    .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.previewLoading.stop())).subscribe(result => {
      if (result) {
        this.sales = result['result'];
      } else {
        WsToastService.toastSubject.next({ content: 'Please select a valid date!', type: 'danger' })
      }
    }, (err) => {
        WsToastService.toastSubject.next({ content: 'Please select a valid date!', type: 'danger' })
    });
  }
  renderDailySalesToXLSX(result) {
    result = result.map(sale => {
      return {
        'No Invoice': sale.receiptId,
        'Completed Date': moment(sale.completedAt).format('YYYY-MM-DD'),
        'Delivery Fee (RM)': sale.totalDelivery.toFixed(2),
        'Discount (RM)': sale.totalDelivery.toFixed(2),
        'Subtotal (RM)': sale.subtotal.toFixed(2),
        'Total (RM)': sale.total.toFixed(2)
      }
    });
    result = this.addDailyTotalRow(result);
    let fromDate = moment(this.fromDate.value).format('DD_MMM_YYYY');
    let toDate = moment(this.toDate.value).format('DD_MMM_YYYY');
    this.exportExcel(result, 'daily_sales', `${fromDate}-${toDate}`);
  }
  renderMonthlySalesToXLSX(result) {
    let monthlyResult = result;
    monthlyResult = _.orderBy(monthlyResult, result => {
      return moment(result.date)
    });
    monthlyResult = monthlyResult.map((sale) => {
      return {
        'Date': moment(sale.date).format('DD/MMM/YYYY'),
        'Number of Completed': sale.numberOfCompleted,
        'Delivery Fee (RM)': sale.deliveryFee.toFixed(2),
        'Discount (RM)': sale.discount.toFixed(2),
        'Subtotal (RM)': sale.subtotal.toFixed(2),
        'Total (RM)': sale.total.toFixed(2)
      }
    });
    result = this.addMonthlyTotalRow(monthlyResult);
    this.exportExcel(monthlyResult, 'monthly_sales', moment(this.fromDate.value).format('MMM_YYYY'));
  }
  renderYearlySalesToXLSX(result) {
    let yearlyResult = result;
    yearlyResult = _.orderBy(yearlyResult, result => {
      return moment(result.date)
    });
    yearlyResult = yearlyResult.map((sale) => {
      return {
        'Date': moment(sale.date).format('MMM/YYYY'),
        'Number of Completed': sale.numberOfCompleted,
        'Delivery Fee (RM)': sale.deliveryFee.toFixed(2),
        'Discount (RM)': sale.discount.toFixed(2),
        'Subtotal (RM)': sale.subtotal.toFixed(2),
        'Total (RM)': sale.total.toFixed(2)
      }
    });
    result = this.addYearlyTotalRow(yearlyResult);
    this.exportExcel(yearlyResult, 'yearly_sales', moment(this.fromDate.value).format('YYYY'));
  }
  exportExcel(result, prefix='', sheetName) {
    let workSheet = XLSX.utils.json_to_sheet(result);
    workSheet["!cols"] = this.getMaxColumnWidth(result);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, sheetName);
    let currentDate = moment().format('YYYY_MM_DD_HH_mm_ss')
    XLSX.writeFile(wb, prefix + '_' + currentDate + '.xlsx');
  }
  addDailyTotalRow(result) {
    result.push({
      'No Invoice': 'Total',
      'Completed Date': '',
      'Delivery Fee (RM)': _.sumBy(result, (x) => +x['Delivery Fee (RM)']).toFixed(2),
      'Discount (RM)': _.sumBy(result, (x) => +x['Discount (RM)']).toFixed(2),
      'Subtotal (RM)': _.sumBy(result, (x) => +x['Subtotal (RM)']).toFixed(2),
      'Total (RM)': _.sumBy(result, (x) => +x['Total (RM)']).toFixed(2)
    })
    return result;
  }
  addMonthlyTotalRow(result) {
    result.push({
      'Date': 'Total',
      'Number of Completed': _.sumBy(result, (x) => +x['Number of Completed']),
      'Delivery Fee (RM)': _.sumBy(result, (x) => +x['Delivery Fee (RM)']).toFixed(2),
      'Discount (RM)': _.sumBy(result, (x) => +x['Discount (RM)']).toFixed(2),
      'Subtotal (RM)': _.sumBy(result, (x) => +x['Subtotal (RM)']).toFixed(2),
      'Total (RM)': _.sumBy(result, (x) => +x['Total (RM)']).toFixed(2)
    })
    return result;
  }
  addYearlyTotalRow(result) {
    return this.addMonthlyTotalRow(result);
  }
  getMaxColumnWidth(result) {
    let objectMaxLength = [];
    var wscols = [];
    let keys = Object.keys(result[0])
    for (let i = 0; i < keys.length; i++) {
      objectMaxLength[i] = keys[i].length > 15 ? keys[i].length : 15;
    }
    for (let j = 0; j < objectMaxLength.length; j++) {
      wscols.push({width: objectMaxLength[j]});
    }
    return wscols;
  }
  goBack() {
    this.isPreview = false;
  }
}