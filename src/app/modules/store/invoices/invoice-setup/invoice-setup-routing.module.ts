import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSetupComponent } from '@components/store/invoices/invoice-setup/invoice-setup.component';


const routes: Routes = [{
  path: '',
  component: InvoiceSetupComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceSetupRoutingModule { }
