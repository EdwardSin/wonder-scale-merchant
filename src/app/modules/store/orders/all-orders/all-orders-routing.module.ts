import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllOrdersComponent } from '@components/store/orders/all-orders/all-orders.component';


const routes: Routes = [
  {
    path: '',
    component: AllOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllOrdersRoutingModule { }
