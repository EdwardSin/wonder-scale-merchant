import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Directive } from '@angular/core';

export const FORMAT = {
    parse: {
        dateInput: 'DD/MMM/YYYY',
    },
    display: {
        dateInput: 'DD/MMM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Directive({
    selector: '[dateFormat]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: FORMAT },
    ],
})
export class DateFormatDirective {
}
