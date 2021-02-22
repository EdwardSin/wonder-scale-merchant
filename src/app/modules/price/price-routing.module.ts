import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceComponent } from '@components/public/price/price.component';


const routes: Routes = [{
  path: '',
  component: PriceComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
