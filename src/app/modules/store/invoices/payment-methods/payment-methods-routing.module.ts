import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentMethodsComponent } from '@components/store/invoices/payment-methods/payment-methods.component';


const routes: Routes = [{
  path: '',
  component: PaymentMethodsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule { }
