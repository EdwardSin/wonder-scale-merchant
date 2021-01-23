import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesFigureRoutingModule } from './sales-figure-routing.module';
import { SalesFigureComponent } from '@components/store/analysis/sales-figure/sales-figure.component';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [SalesFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    SalesFigureRoutingModule
  ]
})
export class SalesFigureModule { }
