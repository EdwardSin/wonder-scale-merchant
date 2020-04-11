import { Pipe, PipeTransform } from '@angular/core';
import { HtmlParser } from '@angular/compiler';

@Pipe({
  name: 'limitTo'
})
export class WsLimitCtrlPipe implements PipeTransform {
  transform(value: any, limitNumber: any): any {
    let result;
    if (Array.isArray(value)) {
      result = this.getElements(value, limitNumber);
    } else if (typeof value === 'string') {
      result = this.getChars(value, limitNumber);
    }
    return result;
  }

  getElements(value, limitNumber) {
    return value.length > limitNumber ? value.slice(0, limitNumber) : value;
  }
  getChars(value, limitNumber) {
    return value.length > limitNumber
      ? value.slice(0, limitNumber) + '...'
      : value;
  }
}
