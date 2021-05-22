import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesComponent } from '@components/store/invoices/invoices.component';


const routes: Routes = [{
  path: '',
  component: InvoicesComponent,
  children: [
    {
      path: '',
      redirectTo: 'get-started',
      pathMatch: 'full'
    },
    {
      path: 'get-started',
      data: { title: 'get-started', breadcrumb: 'Get Started' },
      loadChildren: () => import('./invoice-setup/invoice-setup.module').then(m => m.InvoiceSetupModule)
    },
    {
      path: 'all-invoices',
      data: { title: 'all-invoices', breadcrumb: 'All Invoices' },
      loadChildren: () => import('./all-invoices/all-invoices.module').then(m => m.AllInvoicesModule)
    },
    // { 
    //   path: 'customers',
    //   data: { title: 'customers', breadcrumb: 'Customers' },
    //   loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
    // },
    {
      path: 'delivery',
      data: { title: 'delivery', breadcrumb: 'Delivery' },
      loadChildren: () => import('./delivery/delivery.module').then(m => m.DeliveryModule)
    },
    {
      path: 'promotions',
      data: { title: 'promotions', breadcrumb: 'Promotions' },
      loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule)
    },
    {
      path: 'payment-methods',
      data: { title: 'payment-methods', breadcrumb: 'Payment Methods' },
      loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule)
    },
    {
      path: 'configurations',
      data: { title: 'configurations', breadcrumb: 'Configurations' },
      loadChildren: () => import('./configurations/configurations.module').then(m => m.ConfigurationsModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
