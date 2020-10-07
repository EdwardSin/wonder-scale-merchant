import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewComponent } from '@components/store/catalogue/item-view/item-view.component';
import { ItemControllerComponent } from '@components/store/catalogue/item-controller/item-controller.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ImportItemsModalComponent } from '@components/modals/import-items-modal/import-items-modal.component';
import { MoveToCategoriesModalComponent } from '@components/modals/move-to-categories-modal/move-to-categories-modal.component';
import { EditMultipleItemsModalComponent } from '@components/modals/edit-multiple-items-modal/edit-multiple-items-modal.component';
import { AddToCategoriesModalComponent } from '@components/modals/add-to-categories-modal/add-to-categories-modal.component';
import { SharedItemsRoutingModule } from './shared-items-routing.module';


@NgModule({
  declarations: [
    ItemControllerComponent,
    ItemViewComponent,
    AddToCategoriesModalComponent,
    EditMultipleItemsModalComponent,
    MoveToCategoriesModalComponent,
    ImportItemsModalComponent,
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
    AddToCategoriesModalComponent,
    EditMultipleItemsModalComponent,
    MoveToCategoriesModalComponent,
    ImportItemsModalComponent,
  ]
})
export class SharedItemsModule { }
