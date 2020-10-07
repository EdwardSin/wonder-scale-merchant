import { NgModule } from '@angular/core';
import { DiscountItemsRoutingModule } from './discount-items-routing.module';
import { DiscountItemsComponent } from '@components/store/catalogue/discount-items/discount-items.component';
import { SharedItemsModule } from '../shared-items/shared-items.module';


@NgModule({
  declarations: [DiscountItemsComponent],
  imports: [
    SharedItemsModule,
    DiscountItemsRoutingModule
  ],
  exports: [
    DiscountItemsComponent
  ]
})
export class DiscountItemsModule { }
