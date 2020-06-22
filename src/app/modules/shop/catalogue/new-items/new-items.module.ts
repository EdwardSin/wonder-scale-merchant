import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewItemsRoutingModule } from './new-items-routing.module';
import { NewItemsComponent } from '@components/shop/catalogue/new-items/new-items.component';
import { SharedItemsModule } from '../shared-items/shared-items.module';


@NgModule({
  declarations: [NewItemsComponent],
  imports: [
    SharedItemsModule,
    NewItemsRoutingModule
  ]
})
export class NewItemsModule { }
