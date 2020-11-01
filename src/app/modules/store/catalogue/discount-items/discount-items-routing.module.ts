import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountItemsComponent } from '@components/store/catalogue/discount-items/discount-items.component';


const routes: Routes = [{
  path: '',
  component: DiscountItemsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountItemsRoutingModule { }
