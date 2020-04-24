import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountconverter'
})
export class WsDiscountconverterPipe implements PipeTransform {
  transform(value: any, discount_percentage = 0): any {
    var discount = Number(value);
    if (value >= 0) {
      discount = (value * (100 - discount_percentage)) / 100;
    }
    return discount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
