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
    { path: 'history', component: HistoryComponent, data: { title: 'history', breadcrumb: 'History' } },
    { path: 'payment-methods', component: PaymentMethodsComponent, data: { title: 'payment-methods', breadcrumb: 'Payment Methods' } },
    { path: 'subscription', component: SubscriptionComponent, data: { title: 'subscription', breadcrumb: 'Subscription' } }]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
