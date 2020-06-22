import { NgModule } from '@angular/core';

import { PublishedItemsRoutingModule } from './published-items-routing.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { PublishedItemsComponent } from '@components/shop/catalogue/published-items/published-items.component';


@NgModule({
  declarations: [PublishedItemsComponent],
  imports: [
    SharedItemsModule,
    PublishedItemsRoutingModule
  ]
})
export class PublishedItemsModule { }
