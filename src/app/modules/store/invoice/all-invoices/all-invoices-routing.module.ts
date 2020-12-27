import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllInvoicesComponent } from '@components/store/invoices/all-invoices/all-invoices.component';


const routes: Routes = [
  {
    path: '',
    component: AllInvoicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllInvoicesRoutingModule { }
