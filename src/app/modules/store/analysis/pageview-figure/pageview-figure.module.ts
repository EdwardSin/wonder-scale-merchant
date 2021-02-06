import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageViewFigureRoutingModule } from './pageview-figure-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { PageviewFigureComponent } from '@components/store/analysis/pageview-figure/pageview-figure.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [PageviewFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    PageViewFigureRoutingModule
  ]
})
export class PageviewFigureModule { }
