import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Directive } from '@angular/core';

export const FORMAT = {
    parse: {
        dateInput: 'MMM/YYYY',
    },
    display: {
        dateInput: 'MMM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Directive({
    selector: '[yearMonthFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: FORMAT },
    ],
})
export class YearMonthFormatDirective {
}
