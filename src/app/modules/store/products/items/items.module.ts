import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from '@components/store/products/items/items.component';
import { SharedItemsModule } from '../shared-items/shared-items.module';


@NgModule({
  declarations: [ItemsComponent],
  imports: [
    SharedItemsModule,
    ItemsRoutingModule
  ]
})
export class ItemsModule { }
