import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingComponent } from '@components/store/invoices/accounting/accounting.component';


const routes: Routes = [{
  path: '',
  component: AccountingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
