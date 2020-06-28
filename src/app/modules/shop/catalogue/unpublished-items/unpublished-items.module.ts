import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnpublishedItemsRoutingModule } from './unpublished-items-routing.module';
import { UnpublishedItemsComponent } from '@components/shop/catalogue/unpublished-items/unpublished-items.component';
import { SharedItemsModule } from '../shared-items/shared-items.module';


@NgModule({
  declarations: [UnpublishedItemsComponent],
  imports: [
    SharedItemsModule,
    UnpublishedItemsRoutingModule
  ]
})
export class UnpublishedItemsModule { }
