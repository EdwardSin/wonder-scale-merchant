import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemViewComponent } from '@components/store/products/item-view/item-view.component';
import { ItemControllerComponent } from '@components/store/products/item-controller/item-controller.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ImportItemsModalComponent } from '@components/modals/import-items-modal/import-items-modal.component';
import { EditMultipleItemsModalComponent } from '@components/modals/edit-multiple-items-modal/edit-multiple-items-modal.component';
import { AddToCategoriesModalComponent } from '@components/modals/add-to-categories-modal/add-to-categories-modal.component';
import { SharedItemsRoutingModule } from './shared-items-routing.module';
import { ExportSalesModalComponent } from '@components/modals/export-sales-modal/export-sales-modal.component';


@NgModule({
  declarations: [
    ItemControllerComponent,
    ItemViewComponent,
    AddToCategoriesModalComponent,
    EditMultipleItemsModalComponent,
    ImportItemsModalComponent,
    ExportSalesModalComponent
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
    ImportItemsModalComponent,
    ExportSalesModalComponent
  ]
})
export class SharedItemsModule { }
