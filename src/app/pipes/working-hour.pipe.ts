import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workingHour'
})
export class WorkingHourPipe implements PipeTransform {

  transform(working_hour_type: any, value?: any): any {
    switch (working_hour_type) {
      case 'regularHours':
        return 'Regular hours, Mondays - Fridays';
      case 'shiftRequired':
        return 'Shift required';
      case 'normalShift':
        return 'Normal Shift or 12-hours Rotating Shift';
      case 'others':
        return value;
    }
  }

}
