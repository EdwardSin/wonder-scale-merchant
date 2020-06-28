import { NgModule } from '@angular/core';

import { TodaySpecialItemsRoutingModule } from './today-special-items-routing.module';
import { SharedItemsModule } from '../shared-items/shared-items.module';
import { TodaySpecialItemsComponent } from '@components/shop/catalogue/today-special-items/today-special-items.component';


@NgModule({
  declarations: [TodaySpecialItemsComponent],
  imports: [
    SharedItemsModule,
    TodaySpecialItemsRoutingModule
  ]
})
export class TodaySpecialItemsModule { }
