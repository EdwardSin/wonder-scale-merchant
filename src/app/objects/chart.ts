import { Color } from "ng2-charts";

export class Chart{
    static  lineGraphType: string = 'line';
    static lineChartColors: Color[] = [
      {
        borderColor: '#b71c1c',
        backgroundColor: 'rgba(127, 0, 0, .5)',
      },
    ];
    static lineChartOptions = {
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
    public static createChart() {
      return {
        data: [{data: [], label: 1}],
        labels: [],
        legend: false,
        options: this.lineChartOptions,
        chartType: this.lineGraphType,
        colors: this.colorSchema
      }
    }
  }