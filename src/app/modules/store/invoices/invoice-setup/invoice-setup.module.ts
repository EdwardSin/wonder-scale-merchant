import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSetupRoutingModule } from './invoice-setup-routing.module';
import { InvoiceSetupComponent } from '@components/store/invoices/invoice-setup/invoice-setup.component';


@NgModule({
  declarations: [InvoiceSetupComponent],
  imports: [
    CommonModule,
    InvoiceSetupRoutingModule
  ]
})
export class InvoiceSetupModule { }
