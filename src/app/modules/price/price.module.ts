import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceComponent } from '@components/public/price/price.component';
import { ElementModule } from '../public/element/element.module';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [PriceComponent],
  imports: [
    CommonModule,
    SharedModule,
    ElementModule,
    PriceRoutingModule
  ]
})
export class PriceModule { }
