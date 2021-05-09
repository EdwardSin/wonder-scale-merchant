import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from '@components/store/invoices/delivery/delivery.component';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [DeliveryComponent],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    DeliveryRoutingModule
  ]
})
export class DeliveryModule { }
