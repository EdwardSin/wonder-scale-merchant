import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidation {
  static Valid(AC: AbstractControl) {
    const date = AC.get('date').value;
    const month = AC.get('month').value;
    const year = AC.get('year').value;
    if (
      !date ||
      !month ||
      !year ||
      (date &&
        month &&
        year &&
        !moment(year + '-' + month + '-' + date, 'YYYY-MMM-DD', true).isValid())
    ) {
      AC.get('date').setErrors({ ValidDate: true });
    } else {
      AC.get('date').setErrors(null);
    }
  }
}
