import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Color } from 'ng2-charts';
import { AuthTrackContributorService } from '@services/http/auth-store/contributor/auth-track-contributor.service';
import { Subject, timer } from 'rxjs';
import { takeUntil, delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('numberOfCustomer', { static: true }) numberOfCustomer: ElementRef;
  public lineGraphType: string = 'line';
  lineChartColors: Color[] = [
    {
      borderColor: '#3366cc',
      backgroundColor: 'rgba(132, 163, 225, .5)',
    },
  ];
  lineChartOptions = {scales: {
    yAxes: [{
        ticks: {
            beginAtZero: true,
            callback: function (value) { if (Number.isInteger(value)) { return value; } }
        }
    }]
  }}

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
  charts = [];
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authTrackContributorService: AuthTrackContributorService) {
    this.getTargetsInSession();
  }
  ngOnInit(): void {
    this.setupData();
    this.getBetweenTracks();
    this.getTodayTrack();
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
          this.charts = [];
          result['result'].forEach((track, index) => {
            this.renderChart(track, index);
          })
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
  renderChart(track, i) {
    this.charts.push({
      title: track.name,
      data: track.value.map(_value => _value.value.length),
      labels: this.getDateRange(this.fromDate, this.toDate),
      isUnavailable: false,
      isLoading: false,
      legend: false,
      chartType: 'line',
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      },
      colors: [
        this.colorSchema[i % this.colorSchema.length]
      ]
    });
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
