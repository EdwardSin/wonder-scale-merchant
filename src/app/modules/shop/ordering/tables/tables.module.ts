import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { TablesComponent } from '@components/shop/ordering/tables/tables.component';
import { ImportTablesModalComponent } from '@components/modals/import-tables-modal/import-tables-modal.component';


@NgModule({
  declarations: [TablesComponent, ImportTablesModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    TablesRoutingModule
  ]
})
export class TablesModule { }
