import { NgModule } from '@angular/core';

import { UncategorizedItemsRoutingModule } from './uncategorized-items-routing.module';
import { UncategorizedItemsComponent } from '@components/store/catalogue/uncategorized-items/uncategorized-items.component';
import { SharedItemsModule } from '../shared-items/shared-items.module';


@NgModule({
  declarations: [UncategorizedItemsComponent],
  imports: [
    SharedItemsModule,
    UncategorizedItemsRoutingModule
  ]
})
export class UncategorizedItemsModule { }
