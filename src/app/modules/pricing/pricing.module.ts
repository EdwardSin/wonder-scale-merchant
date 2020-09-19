import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from '@components/public/pricing/pricing.component';
import { ElementModule } from '../public/element/element.module';
import { SharedModule } from '../public/shared/shared.module';


@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    PricingRoutingModule
  ]
})
export class PricingModule { }
