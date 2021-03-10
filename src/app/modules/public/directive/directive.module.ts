import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalDirective } from '../../../directives/modal.directive';
import { ClickoutsideDirective } from '../../../directives/clickoutside.directive';
import { AutofocusDirective } from '../../../directives/autofocus.directive';
import { DebounceClickDirective } from '../../../directives/debounce-click.directive';
import { NavItemDirective } from '../../../directives/nav-item.directive';
import { YearMonthFormatDirective } from 'src/app/directives/date_format/year-month-format.directive';
import { DateFormatDirective } from 'src/app/directives/date_format/date-format.directive';
import { YearFormatDirective } from 'src/app/directives/date_format/year-format.directive';


@NgModule({
  declarations: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective,
    NavItemDirective,
    DateFormatDirective,
    YearMonthFormatDirective,
    YearFormatDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective,
    NavItemDirective,
    DateFormatDirective,
    YearMonthFormatDirective,
    YearFormatDirective
  ]
})
export class DirectiveModule { }
