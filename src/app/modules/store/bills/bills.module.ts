import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from '@components/store/bills/bills.component';
import { SharedModule } from '../../public/shared/shared.module';


@NgModule({
  declarations: [BillsComponent],
  imports: [
    CommonModule,
    SharedModule,
    BillsRoutingModule
  ]
})
export class BillsModule { }
