import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllInvoicesRoutingModule } from './all-invoices-routing.module';
import { AllInvoicesComponent } from '@components/store/invoices/all-invoices/all-invoices.component';
import { SharedModule } from 'src/app/modules/public/shared/shared.module';
import { ElementModule } from 'src/app/modules/public/element/element.module';
import { ModifyInvoiceModalComponent } from '@components/modals/modify-invoice-modal/modify-invoice-modal.component';
import { InvoiceInfoModalComponent } from '@components/modals/invoice-info-modal/invoice-info-modal.component';


@NgModule({
  declarations: [
    AllInvoicesComponent, 
    ModifyInvoiceModalComponent,
    InvoiceInfoModalComponent
  ],
  imports: [
    CommonModule,
    ElementModule,
    SharedModule,
    AllInvoicesRoutingModule
  ]
})
export class AllInvoicesModule { }
