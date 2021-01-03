import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesComponent } from '@components/store/invoices/invoices.component';


const routes: Routes = [{
  path: '',
  component: InvoicesComponent,
  children: [
    {
      path: '',
      redirectTo: 'all-invoices',
      pathMatch: 'full'
    },
    {
      path: 'all-invoices',
      data: { title: 'all-invoices', breadcrumb: 'All Invoices' },
      loadChildren: () => import('./all-invoices/all-invoices.module').then(m => m.AllInvoicesModule)
    },
    { 
      path: 'customers',
      data: { title: 'customers', breadcrumb: 'Customers' },
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
    },
    {
      path: 'promotions',
      data: { title: 'promotions', breadcrumb: 'Promotions' },
      loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule)
    },
    {
      path: 'accounting',
      data: { title: 'accounting', breadcrumb: 'Accounting' },
      loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
