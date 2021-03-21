import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionFigureRoutingModule } from './promotion-figure-routing.module';
import { PromotionFigureComponent } from '@components/store/analysis/promotion-figure/promotion-figure.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [PromotionFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    PromotionFigureRoutingModule
  ]
})
export class PromotionFigureModule { }
