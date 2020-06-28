import { NgModule } from '@angular/core';

import { AllItemsRoutingModule } from './all-items-routing.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { AllItemsComponent } from '@components/shop/catalogue/all-items/all-items.component';


@NgModule({
  declarations: [AllItemsComponent],
  imports: [
    SharedItemsModule,
    AllItemsRoutingModule
  ]
})
export class AllItemsModule { }
