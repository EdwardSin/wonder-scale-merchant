import { NgModule } from '@angular/core';

import { NewItemsRoutingModule } from './new-items-routing.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { NewItemsComponent } from '@components/store/on-selling-products/new-items/new-items.component';


@NgModule({
  declarations: [NewItemsComponent],
  imports: [
    SharedItemsModule,
    NewItemsRoutingModule
  ]
})
export class NewItemsModule { }
