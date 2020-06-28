import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationRoutingModule } from './information-routing.module';
import { InformationComponent } from '@components/shop/information/information.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [
    InformationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InformationRoutingModule
  ]
})
export class InformationModule { }
