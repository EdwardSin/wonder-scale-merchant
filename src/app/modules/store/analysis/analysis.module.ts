import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisRoutingModule } from './analysis-routing.module';
import { SharedItemsModule } from '../catalogue/shared-items/shared-items.module';
import { AnalysisComponent } from '@components/store/analysis/analysis.component';


@NgModule({
  declarations: [
    AnalysisComponent
  ],
  imports: [
    CommonModule,
    SharedItemsModule,
    AnalysisRoutingModule
  ]
})
export class AnalysisModule { }
