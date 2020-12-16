import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from '@components/store/orders/customers/customers.component';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [CustomersComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
