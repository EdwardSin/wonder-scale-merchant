import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingFigureRoutingModule } from './tracking-figure-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { TrackingFigureComponent } from '@components/store/tracking/tracking-figure/tracking-figure.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [TrackingFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    TrackingFigureRoutingModule
  ]
})
export class TrackingFigureModule { }
