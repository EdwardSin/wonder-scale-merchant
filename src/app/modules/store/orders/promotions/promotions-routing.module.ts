import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionsComponent } from '@components/store/orders/promotions/promotions.component';


const routes: Routes = [
  {
    path: '',
    component: PromotionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionsRoutingModule { }
