import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class WsCurrencyPipe implements PipeTransform {

  transform(price: number, itemRate: number, targetRate:number): any {
    return (price / itemRate * targetRate).toFixed(2);
  }
}
