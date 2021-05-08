import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceSetupRoutingModule } from './invoice-setup-routing.module';
import { InvoiceSetupComponent } from '@components/store/invoices/invoice-setup/invoice-setup.component';
import { ElementModule } from 'src/app/modules/public/element/element.module';


@NgModule({
  declarations: [InvoiceSetupComponent],
  imports: [
    CommonModule,
    ElementModule,
    InvoiceSetupRoutingModule
  ]
})
export class InvoiceSetupModule { }
