import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountconverter'
})
export class WsDiscountconverterPipe implements PipeTransform {
  transform(value: any, discountPercentage = 0): any {
    var discount = +value;
    if (value >= 0) {
      discount = (value * (100 - discountPercentage)) / 100;
    }
    return discount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
