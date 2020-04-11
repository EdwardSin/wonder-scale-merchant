import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passDate'
})
export class WsPassDatePipe implements PipeTransform {

  transform(value: Date, args?: any): any {
    return this.prettyDate(new Date(value).toLocaleString());
  }
  prettyDate(time){
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);
        
    if ( isNaN(day_diff) || day_diff < 0)
      return;
        
      return day_diff == 0 && (
        diff < 60 && "just now" ||
        diff < 120 && "1 minute ago" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        diff < 7200 && "1 hour ago" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      day_diff == 1 && "Yesterday" ||
      day_diff < 7 && day_diff + " days ago" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
      day_diff > 30 && day_diff< 365 && Math.ceil(day_diff/30) + " months ago" ||
      day_diff >= 365 && Math.ceil(day_diff / 365) + " years ago";
  }
}
