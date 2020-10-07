import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from '@components/store/billing/billing/billing.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    SharedModule,
    BillingRoutingModule
  ]
})
export class BillingModule { }
