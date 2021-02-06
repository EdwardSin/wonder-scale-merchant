import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralFigureRoutingModule } from './general-figure-routing.module';
import { GeneralFigureComponent } from '@components/store/analysis/general-figure/general-figure.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [GeneralFigureComponent],
  imports: [
    CommonModule,
    SharedModule,
    GeneralFigureRoutingModule
  ]
})
export class GeneralFigureModule { }
