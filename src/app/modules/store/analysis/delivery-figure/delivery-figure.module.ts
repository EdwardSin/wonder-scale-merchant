import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryFigureRoutingModule } from './delivery-figure-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { DeliveryFigureComponent } from '@components/store/analysis/delivery-figure/delivery-figure.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DeliveryFigureComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    DeliveryFigureRoutingModule
  ]
})
export class DeliveryFigureModule { }
