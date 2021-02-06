import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import * as moment from 'moment';
import { Chart } from '@objects/chart';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { ScreenService } from '@services/general/screen.service';

@Component({
  selector: 'app-delivery-figure',
  templateUrl: './delivery-figure.component.html',
  styleUrls: ['./delivery-figure.component.scss']
})
export class DeliveryFigureComponent implements OnInit {
  @ViewChild('monthlyDelivery', { static: true }) monthlyDelivery: ElementRef;
  updatedDate: Date = new Date;
  moment = moment;
  loading: WsLoading = new WsLoading;
  deliveryLoading: WsLoading = new WsLoading;
  cumulativeLoading: WsLoading = new WsLoading;
  startHour: Date = new Date;
  endHour: Date = new Date;
  totalMonthlyDelivery = 0;
  delivery = {
    totalMonthlyDelivery: 0,
    lastMonthDelivery: 0,
    averageMonthlyDelivery: 0
  };
  last60MonthsDate = new Date;
  minDate = new Date;
  maxDate = new Date;
  fromDate = new Date;
  toDate = new Date;
  monthlyDeliveryAnalysisSubscription;
  deliveryChart = Chart.createChart();
  cumulativeChart = Chart.createChart();
  REFRESH_INTERVAL = 30 * 60 * 1000;
  isMobileSize: boolean;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private authAnalysisContributorService: AuthAnalysisContributorService,
    private screenService: ScreenService) { }

  ngOnInit(): void {
    this.setupData();
    this.getMonthlyDelivery();
    this.getYearlyDelivery();
    this.getDeliveryBetweenDates();
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
  getMonthlyDelivery() {
    if (this.monthlyDeliveryAnalysisSubscription) {
      this.monthlyDeliveryAnalysisSubscription.unsubscribe();
    }
    this.monthlyDeliveryAnalysisSubscription = timer(0, this.REFRESH_INTERVAL).pipe(switchMap(() => this.authAnalysisContributorService.getMonthDeliveryAnalysis()),
      takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.delivery = result['result'];
        this.authAnalysisContributorService.increment(this.monthlyDelivery.nativeElement, 1000, this.delivery.totalMonthlyDelivery, true);
      });
  }
  getYearlyDelivery() {
    this.cumulativeLoading.start();
    this.authAnalysisContributorService.getYearlyDeliveryAnalysis().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
    if (result['result']) {
        this.getCumulativeDelivery(result['result']);
      }
    });
  }
  getDeliveryBetweenDates() {
    this.deliveryLoading.start();
    this.authAnalysisContributorService.getDeliveryBetweenDates(this.fromDate, this.toDate).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.deliveryLoading.stop())).subscribe(result => {
      if (result['result']) {
        let dateRange = this.getDateRange(this.fromDate, this.toDate);
        this.deliveryChart.data[0].data = [];
        dateRange.forEach(date => {
          let delivery = result['result'].find(delivery => delivery.name == date);
          this.deliveryChart.data[0].data.push(delivery ? delivery.value : 0);
        });
        this.deliveryChart.labels = this.getDateRange(this.fromDate, this.toDate).map(date => moment(date).format('MM-DD (ddd)'));
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
  getCumulativeDelivery(delivery) {
    let total = 0;
    this.cumulativeChart.data[0].data = [];
    for(let index of Array(12).keys()) {
      let foundDelivery = delivery.find(_delivery => {
        return moment().subtract(12 - index, 'months').startOf('month').diff(moment(_delivery.date).startOf('month'), 'months', true) == 0;
      })
      if (foundDelivery) {
        total += foundDelivery.total;
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
