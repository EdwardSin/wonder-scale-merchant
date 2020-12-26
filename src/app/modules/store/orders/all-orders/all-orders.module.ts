import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllOrdersRoutingModule } from './all-orders-routing.module';
import { AllOrdersComponent } from '@components/store/orders/all-orders/all-orders.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { ModifyOrderModalComponent } from '@components/modals/modify-order-modal/modify-order-modal.component';
import { OrderInfoModalComponent } from '@components/modals/order-info-modal/order-info-modal.component';


@NgModule({
  declarations: [
    AllOrdersComponent, 
    ModifyOrderModalComponent,
    OrderInfoModalComponent
  ],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    AllOrdersRoutingModule
  ]
})
export class AllOrdersModule { }
