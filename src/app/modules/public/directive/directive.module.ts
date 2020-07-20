import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalDirective } from '../../../directives/modal.directive';
import { ClickoutsideDirective } from '../../../directives/clickoutside.directive';
import { AutofocusDirective } from '../../../directives/autofocus.directive';
import { DebounceClickDirective } from '../../../directives/debounce-click.directive';
import { NavItemDirective } from '../../../directives/nav-item.directive';


@NgModule({
  declarations: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective,
    NavItemDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective,
    NavItemDirective
  ]
})
export class DirectiveModule { }
