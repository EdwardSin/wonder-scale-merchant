import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wsEmptyDash'
})
export class WsEmptyDashPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? value : '-';
  }

}
