import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalDirective } from '../../../directives/modal.directive';
import { ClickoutsideDirective } from '../../../directives/clickoutside.directive';
import { AutofocusDirective } from '../../../directives/autofocus.directive';
import { DebounceClickDirective } from '../../../directives/debounce-click.directive';


@NgModule({
  declarations: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective
  ]
})
export class DirectiveModule { }
