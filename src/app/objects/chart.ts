import { Color } from "ng2-charts";
import * as _ from 'lodash';

export class Chart{
    static  graphType: string = 'line';
    static lineChartColors: Color[] = [
      {
        borderColor: '#b71c1c',
        backgroundColor: 'rgba(127, 0, 0, .5)',
      },
    ];
    static chartOptions = {
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
          intersect: false
      }
    }
    static colorSchema = [{
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
    public static createChart(options?, type?, colors?) {
      return _.cloneDeep({
        data: [{data: [], label: 1}],
        labels: [],
        legend: false,
        options: _.assignIn({}, this.chartOptions, options),
        chartType: type || this.graphType,
        colors: colors || this.colorSchema
      });
    }
    public static createPieChart(options?, colors?) {
      return _.cloneDeep({
        data: [],
        labels: [],
        legend: false,
        options: _.assignIn({}, options, {
          responsive: true,
          maintainAspectRatio: false
        }),
        chartType: 'doughnut',
        colors: colors || this.colorSchema
      });
    }
  }