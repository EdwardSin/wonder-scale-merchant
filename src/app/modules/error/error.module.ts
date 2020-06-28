import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from '../../components/public/error/error.component';


@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule
  ]
})
export class ErrorModule { }
