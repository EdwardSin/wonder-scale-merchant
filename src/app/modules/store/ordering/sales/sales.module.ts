import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { SalesComponent } from '@components/store/ordering/sales/sales.component';


@NgModule({
  declarations: [SalesComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
