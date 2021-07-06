import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewComponent } from '@components/store/on-selling-products/item-view/item-view.component';
import { ItemControllerComponent } from '@components/store/on-selling-products/item-controller/item-controller.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { SharedItemsRoutingModule } from './shared-items-routing.module';
import { ModifyOnSellingItemModalComponent } from '@components/modals/modify-on-selling-item-modal/modify-on-selling-item-modal.component';
import { ElementModule } from 'src/app/modules/public/element/element.module';


@NgModule({
  declarations: [
    ItemControllerComponent,
    ItemViewComponent,
    ModifyOnSellingItemModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedItemsRoutingModule
  ],
  exports: [
    CommonModule,
    ItemControllerComponent,
    ItemViewComponent,
    ModifyOnSellingItemModalComponent,
    SharedModule
  ]
})
export class SharedItemsModule { }
