import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewComponent } from '@components/store/on-selling-products/item-view/item-view.component';
import { ItemControllerComponent } from '@components/store/on-selling-products/item-controller/item-controller.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { SharedItemsRoutingModule } from './shared-items-routing.module';
import { ModifyOnSellingItemModalComponent } from '@components/modals/modify-on-selling-item-modal/modify-on-selling-item-modal.component';
import { MoveToCategoriesModalComponent } from '@components/modals/move-to-categories-modal/move-to-categories-modal.component';


@NgModule({
  declarations: [
    ItemControllerComponent,
    ItemViewComponent,
    MoveToCategoriesModalComponent,
    ModifyOnSellingItemModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedItemsRoutingModule
  ],
  exports: [
    CommonModule,
    SharedModule,
    ItemControllerComponent,
    ItemViewComponent,
    MoveToCategoriesModalComponent,
    ModifyOnSellingItemModalComponent
  ]
})
export class SharedItemsModule { }
