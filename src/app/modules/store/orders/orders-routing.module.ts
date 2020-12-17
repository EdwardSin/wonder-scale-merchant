import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from '@components/store/orders/orders.component';


const routes: Routes = [{
  path: '',
  component: OrdersComponent,
  children: [
    {
      path: '',
      redirectTo: 'customers',
      pathMatch: 'full'
    },
    // {
    //   path: 'all-orders',
    //   data: { title: 'all-orders', breadcrumb: 'All Orders' },
    //   loadChildren: () => import('./all-orders/all-orders.module').then(m => m.AllOrdersModule)
    // },
    { 
      path: 'customers',
      data: { title: 'customers', breadcrumb: 'Customers' },
      loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
    },
    {
      path: 'promotions',
      data: { title: 'promotions', breadcrumb: 'Promotions' },
      loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
