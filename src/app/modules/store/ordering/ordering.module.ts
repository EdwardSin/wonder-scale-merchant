import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderingRoutingModule } from './ordering-routing.module';
import { OrderingComponent } from '@components/store/ordering/ordering.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [OrderingComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrderingRoutingModule
  ]
})
export class OrderingModule { }
