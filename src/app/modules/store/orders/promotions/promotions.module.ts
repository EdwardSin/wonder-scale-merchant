import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from '@components/store/orders/promotions/promotions.component';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';


@NgModule({
  declarations: [
    PromotionsComponent
  ],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    PromotionsRoutingModule
  ]
})
export class PromotionsModule { }
