import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Color } from 'ng2-charts';
import { AuthTrackContributorService } from '@services/http/auth-store/contributor/auth-track-contributor.service';
import { Subject, timer } from 'rxjs';
import { takeUntil, delay, switchMap } from 'rxjs/operators';
import { ScreenService } from '@services/general/screen.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { SharedStoreService } from '@services/shared/shared-store.service';

@Component({
  selector: 'app-tracking-figure',
  templateUrl: './tracking-figure.component.html',
  styleUrls: ['./tracking-figure.component.scss']
})
export class TrackingFigureComponent implements OnInit {
  @ViewChild('numberOfCustomer', { static: true }) numberOfCustomer: ElementRef;
  public lineGraphType: string = 'line';
  isMobileSize: boolean = false;
  lineChartColors: Color[] = [
    {
      borderColor: '#b71c1c',
      backgroundColor: 'rgba(127, 0, 0, .5)',
    },
  ];
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMax: 100,
          beginAtZero: true,
          callback: function (value) { if (Number.isInteger(value)) { return value; } }
        }
      }]
    },
    tooltips: {
        mode: 'index',
        axis: 'y'
    }
  }

  hours: string[];
  numberOfCustomersToday: number[] = [];
  loading: WsLoading = new WsLoading;
  todayTrackLoading: WsLoading = new WsLoading;
  tracksLoading: WsLoading = new WsLoading;
  targets = ['Number of Total Customers'];
  fromDate = new Date;
  toDate = new Date;
  updatedDate = new Date;
  minDate = new Date;
  maxDate = new Date;
  allHours: number[];
  startHour: number = 0;
  selectionOpened: boolean;
  isSelectionChange: boolean;
  totalNumberOfCustomerToday: number = 0;
  tracks = [{ name: 'Number of Total Customers' }];
  colorSchema = [{
    borderColor: '#b71c1c',
    backgroundColor: 'rgba(127, 0, 0, .5)',
  }, {
    borderColor: '#b380ff',
    backgroundColor: 'rgba(179, 128, 255, .5)'
  }, {
    borderColor: '#009999',
    backgroundColor: 'rgba(0, 153, 153, .5)'
  }, {
    borderColor: '#33cc33',
    backgroundColor: 'rgba(51, 204, 51, .5)'
  }, {
    borderColor: '#ff6600',
    backgroundColor: 'rgba(255, 102, 0, .5)'
  }, {
    borderColor: '#cc3399',
    backgroundColor: 'rgba(204, 51, 153, .5)'
  }, {
    borderColor: '#7070db',
    backgroundColor: 'rgba(112, 112, 219, .5)'
  }
  ];
  moment = moment;
  todayTrackSubscription;
  dateBetweenTrackSubscription;
  REFRESH_TRACK_INTERVAL = 30 * 60 * 1000;
  historyChart = {
    data: [],
    labels: [],
    legend: [],
    options: this.lineChartOptions,
    chartType: this.lineGraphType,
    colors: this.colorSchema
  }
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService, private screenService: ScreenService, private authTrackContributorService: AuthTrackContributorService) {
    this.getTargetsInSession();
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  ngOnInit(): void {
    this.setupData();
    this.getBetweenTracks();
    this.getTodayTrack();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          DocumentHelper.setWindowTitleWithWonderScale('Figure - ' + result.name);
      }
    });
  }
  setupData() {
    this.allHours = this.getHoursInSelection();
    this.startHour = this.getStartHourInSession();
    this.targets = this.getTargetsInSession();
    this.minDate = new Date;
    this.minDate.setDate(this.minDate.getDate() - 2);
    this.fromDate = this.minDate;
    this.toDate = new Date;
  }
  getTracks() {
    this.authTrackContributorService.getTracks().pipe(takeUntil(this.ngUnsubscribe), delay(500))
      .subscribe(result => {
        this.tracks = [{ name: 'Number of Total Customers' }, ...result['result']];
        this.selectionOpened = true;
        this.tracksLoading.stop();
      });
  }
  getBetweenTracks() {
    this.loading.start();
    this.setTargetsInSession();
    if (this.dateBetweenTrackSubscription) {
      this.dateBetweenTrackSubscription.unsubscribe();
    }
    this.dateBetweenTrackSubscription = timer(0, this.REFRESH_TRACK_INTERVAL).pipe(switchMap(() => this.authTrackContributorService.getTracksBetweenDates(this.fromDate, this.toDate, this.startHour, this.targets)),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result['result']) {
          this.historyChart.data = result['result'].map(item => {
            return {
              data: item.value.map(_value => _value.value.length),
              label: item.name
            };
          });
          this.historyChart.labels = this.getDateRange(this.fromDate, this.toDate);
        }
        this.loading.stop();
      }, () => {
        this.loading.stop();
      })
  }
  getTodayTrack() {
    this.todayTrackLoading.start();
    this.setStartHourInSession();
    if (this.todayTrackSubscription) {
      this.todayTrackSubscription.unsubscribe();
    }
    this.todayTrackSubscription = timer(0, this.REFRESH_TRACK_INTERVAL).pipe(switchMap(() => this.authTrackContributorService.getTodayTrack(this.startHour)),
      takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.updateTodayCustomer(result['result']);
        this.increment(this.numberOfCustomer.nativeElement, 500, this.totalNumberOfCustomerToday);
        this.todayTrackLoading.stop();
        this.updatedDate = new Date;
      })
  }
  getHourRange() {
    let toHour = this.startHour - 1;
    let result = [];
    if (toHour < this.startHour) {
      result = [..._.range(this.startHour, 24), ..._.range(0, toHour + 1)];
    } else {
      result = _.range(this.startHour, toHour + 1);
    }
    result = _.map(result, (x) => {
      return ("0" + x).slice(-2) + ":00";
    });
    return result;
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
  groupDates(results) {
    return _.groupBy(results, (result) => {
      let date = new Date(result);
      let downToHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
      let downToHourAsString = ("0" + downToHour.getHours()).slice(-2) + ":00";
      return downToHourAsString;
    });
  }
  selectionOpenedChange(event) {
    if (!this.selectionOpened) {
      this.tracksLoading.start();
      this.getTracks();
    }
    if (!event && this.isSelectionChange) {
      this.getBetweenTracks();
      this.isSelectionChange = false;
    }
  }
  selectionChange() {
    this.isSelectionChange = true;
  }
  updateTodayCustomer(results) {
    this.numberOfCustomersToday = [];
    this.totalNumberOfCustomerToday = 0;
    this.hours = this.getHourRange();
    let result = this.groupDates(results);
    this.hours.forEach((hour) => {
      if (result[hour]) {
        this.numberOfCustomersToday.push(result[hour].length);
        this.totalNumberOfCustomerToday += result[hour].length;
      } else {
        this.numberOfCustomersToday.push(0);
      }
    });
  }
  increment(target, duration, value) {
    $(target).each(function () {
      $(target).animate({
        value
      }, {
        duration: duration,
        easing: "linear",
        step: function () {
          $(target).text(Math.floor(this.value));
        },
        complete: function () {
          if (parseInt(this.value + 1) !== value) {
            $(target).text(value);
          }
        }
      });
    });
  }
  setStartHourInSession() {
    sessionStorage.setItem('startHour', JSON.stringify(this.startHour));
  }
  setTargetsInSession() {
    sessionStorage.setItem('targets', JSON.stringify(this.targets));
  }
  getStartHourInSession() {
    let startHour = sessionStorage.getItem('startHour');
    if (startHour) {
      return JSON.parse(startHour);
    } else {
      return 0;
    }
  }
  getTargetsInSession() {
    let targets = sessionStorage.getItem('targets');
    if (targets) {
      return JSON.parse(targets);
    } else {
      return ['Number of Total Customers'];
    }
  }
  openCalendar() {
    this.maxDate = new Date();
  }
  getHoursInSelection() {
    return _.map(_.range(24), (x) => {
      return {
        text: ("0" + x).slice(-2) + ":00",
        value: x
      };
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
