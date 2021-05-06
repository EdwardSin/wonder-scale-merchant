import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from '@components/store/invoices/payment-methods/payment-methods.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [PaymentMethodsComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaymentMethodsRoutingModule
  ]
})
export class PaymentMethodsModule { }
