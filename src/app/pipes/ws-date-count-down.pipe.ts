import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateCountDown'
})
export class WsDateCountDownPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value).diff(moment(Date.now()), 'days') + 1;
  }

}
