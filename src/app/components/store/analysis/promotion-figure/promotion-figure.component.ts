import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Chart as WsChart } from '@objects/chart';
import { AuthAnalysisContributorService } from '@services/http/auth-store/contributor/auth-analysis-contributor.service';
import { AuthPromotionContributorService } from '@services/http/auth-store/contributor/auth-promotion-contributor.service';
import { Subject } from 'rxjs';
import { delay, finalize, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-promotion-figure',
  templateUrl: './promotion-figure.component.html',
  styleUrls: ['./promotion-figure.component.scss']
})
export class PromotionFigureComponent implements OnInit {
  moment = moment;
  promotions = [];
  selectedKind = "invoiceNumber";
  selectedPromotions = [];
  selectedPromotion = null;
  ongoingPromotions = [];
  loading: WsLoading = new WsLoading;
  promotionChartLoading: WsLoading = new WsLoading;
  promotionsPieChart = WsChart.createPieChart();
  defaultPieChart = WsChart.createPieChart();
  isDisplayPieChart: boolean;
  previousSelectedPromotionPieChartItem;
  previousPromotionBackgroundColor;
  @ViewChildren( BaseChartDirective ) charts: QueryList<BaseChartDirective>;
  promotionsChartOptions = {
    title: {
      display: true,
      text: ''
    }
  };
  promotionsChart = WsChart.createChart(this.promotionsChartOptions);
  defaultPromotionsChart = WsChart.createChart();
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authPromotionContributorService: AuthPromotionContributorService,
    private authAnalysisContributorService: AuthAnalysisContributorService) {
    this.setupChartConfiguration();
  }
  ngOnInit(): void {
    this.loading.start();
    this.getAllPromotions();
    this.getOngoingPromotions();
  }
  setupChartConfiguration() {
    this.promotionsPieChart.options = {
      tooltips: {
        intersect: false
      },
      hover: {
          onHover: function(event, chartElement) {
            event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      }
    }
    this.defaultPieChart.data = Array.from(Array(10).keys(), () => 10);
    this.defaultPieChart.labels = Array.from(Array(10).keys(), () => 'Promotion Title');
    this.defaultPromotionsChart.data[0].data = [10, 100, 240, 120, 300, 260, 150, 200, 130, 200];
    this.defaultPromotionsChart.labels = Array.from(Array(10).keys(), () => 'Date / Month');
    this.promotionsPieChart.colors = [{
      backgroundColor: [
        'rgba(183, 28, 28, .2)',
        'rgba(172, 20, 80, .2)',
        'rgba(136, 50, 114, .2)',
        'rgba(90, 68, 125, .2)',
        'rgba(52, 74, 112, .2)',
        'rgba(47, 72, 88, .2)',
        'rgba(181, 105, 28, .2)',
        'rgba(181, 181, 28, .2)',
        'rgba(105, 181, 28, .2)',
        'rgba(28, 181, 181, .2)'
      ],
      hoverBackgroundColor: [
        'rgba(183, 28, 28, .9)',
        'rgba(172, 20, 80, .9)',
        'rgba(136, 50, 114, .9)',
        'rgba(90, 68, 125, .9)',
        'rgba(52, 74, 112, .9)',
        'rgba(47, 72, 88, .9)',
        'rgba(181, 105, 28, .9)',
        'rgba(181, 181, 28, .9)',
        'rgba(105, 181, 28, .9)',
        'rgba(28, 181, 181, .9)'
      ]
    }];
    this.defaultPieChart.colors = this.promotionsPieChart.colors;
  }
  getAllPromotions() {
    this.authPromotionContributorService.getPromotions(null).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.promotions = result['result'].map(promotion => {
        return {
          _id: promotion._id,
          name: promotion.title,
          from: promotion.activeDate,
          to: promotion.expiryDate,
          isEnabled: promotion.isEnabled
        }
      });
      this.selectedPromotions = this.promotions.slice(Math.max(0, this.promotions.length - 10), this.promotions.length).map(result => result._id);
      this.getSelectedPromotionsPieDate();
    });
  }
  getOngoingPromotions() {
    this.authAnalysisContributorService.getOngoingPromotions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.ongoingPromotions = result['result'].map(promotion => {
        return {
          _id: promotion._id,
          name: promotion.title,
          from: promotion.activeDate,
          to: promotion.expiryDate,
          isEnabled: promotion.isEnabled,
          value: promotion.numberOfInvoices
        }
      });
    });
  }
  getSelectedPromotionsPieDate() {
    this.resetPieChartColor();
    this.authAnalysisContributorService.getPromotionsInvoiceNumber({promotions: this.selectedPromotions}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      let invoiceNumberPromotions = result['result'];
      this.promotionsPieChart.data = [];
      this.promotionsPieChart.labels = [];
      this.selectedPromotions.forEach(promotion => {
        let selectedInvoiceNumberPromotion = invoiceNumberPromotions.find(invoiceNumberPromotion => invoiceNumberPromotion._id == promotion);
        if (selectedInvoiceNumberPromotion) {
          this.promotionsPieChart.data.push(selectedInvoiceNumberPromotion.numberOfInvoices);
        } else {
          this.promotionsPieChart.data.push(0);
        }
        let selectedPromotion = this.promotions.find(x => x._id === promotion);
        if (selectedPromotion) {
          this.promotionsPieChart.labels.push(selectedPromotion.name);
        }
        this.isShowingChart();
      });
    });
  }
  onPieChartClick(event) {
    let item = event.active;
    if (item && item[0] && item[0]._index > -1) {
      this.promotionChartLoading.start();
      this.selectedPromotion = this.selectedPromotions[item[0]._index];
      this.resetPieChartColor();
      this.updatePieChartColor(item);
      this.authAnalysisContributorService.getPromotionInvoiceNumberBetweenDate({promotion: this.selectedPromotion}).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.promotionChartLoading.stop())).subscribe(result => {
        let promotion = this.promotions.find(x => x._id == this.selectedPromotion);
        let toDate = promotion.to || new Date();
        let fromDate = _.min([...result['result'].map(invoiceGroup => new Date(invoiceGroup.date)), promotion.from]);
        let dates = this.getDateRange(fromDate, toDate).map(date => moment(date));
        this.promotionsChart.labels = this.getDateRange(fromDate, toDate).map(date => moment(date).format('MM-DD (ddd)'));
        this.promotionsChart.data[0].data = [];
        dates.forEach(label => {
          let invoiceGroup = result['result'].find(invoice => {
            return moment(invoice.date).diff(label) == 0;
          });
          if (invoiceGroup) {
            this.promotionsChart.data[0].data.push(invoiceGroup.numberOfInvoices);
          } else {
            this.promotionsChart.data[0].data.push(0);
          }
        })
        this.promotionsChart.options.title.text = promotion.name;
        this.charts.forEach(chart => {
          chart.update();
        });
      });
    }
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
  onPromotionChanged(event) {
    if (event.value <= 1) {
      return;
    }
    this.selectedPromotions = event.value;
    this.getSelectedPromotionsPieDate();
  }
  updatePieChartColor(item) {
    this.previousSelectedPromotionPieChartItem = item[0];
    this.previousPromotionBackgroundColor = item[0]._chart.config.data.datasets[0].backgroundColor[item[0]._index];
    item[0]._chart.config.data.datasets[0].backgroundColor[item[0]._index] = item[0]._chart.config.data.datasets[0].hoverBackgroundColor[item[0]._index];
  }
  resetPieChartColor() {
    if (this.previousSelectedPromotionPieChartItem) {
      this.previousSelectedPromotionPieChartItem._chart.config.data.datasets[0].backgroundColor[
        this.previousSelectedPromotionPieChartItem._index
      ] = this.previousPromotionBackgroundColor;
    }
  }
  isShowingChart() {
    this.isDisplayPieChart = this.promotionsPieChart.data.find(x => x != 0) !== undefined;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
