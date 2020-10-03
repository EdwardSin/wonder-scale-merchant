import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryComponent } from '@components/shop/billing/history/history.component';
import { SubscriptionComponent } from '@components/shop/billing/subscription/subscription.component';
import { PaymentMethodsComponent } from '@components/shop/billing/payment-methods/payment-methods.component';
import { BillingComponent } from '@components/shop/billing/billing/billing.component';


const routes: Routes = [
  {
    path: '',
    component: BillingComponent,
    children: [{ path: '', redirectTo: 'history', pathMatch: 'full' },
    {
      path: 'history',
      data: { title: 'history', breadcrumb: 'History' },
      loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
    },
    { 
      path: 'payment-methods',
      loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule),
      data: { title: 'payment-methods', breadcrumb: 'Payment Methods' } },
    {
      path: 'subscription',
      loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionModule),
      data: { title: 'subscription', breadcrumb: 'Subscription' } }]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
