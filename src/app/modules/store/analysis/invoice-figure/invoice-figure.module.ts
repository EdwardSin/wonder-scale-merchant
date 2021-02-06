import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceFigureRoutingModule } from './invoice-figure-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { InvoiceFigureComponent } from '@components/store/analysis/invoice-figure/invoice-figure.component';


@NgModule({
  declarations: [InvoiceFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    InvoiceFigureRoutingModule
  ]
})
export class InvoiceFigureModule { }
