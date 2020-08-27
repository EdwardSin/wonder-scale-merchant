import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderingRoutingModule } from './ordering-routing.module';
import { OrderingComponent } from '@components/shop/ordering/ordering.component';


@NgModule({
  declarations: [OrderingComponent],
  imports: [
    CommonModule,
    OrderingRoutingModule
  ]
})
export class OrderingModule { }
