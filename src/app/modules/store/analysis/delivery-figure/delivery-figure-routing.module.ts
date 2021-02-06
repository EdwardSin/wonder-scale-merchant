import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryFigureComponent } from '@components/store/analysis/delivery-figure/delivery-figure.component';


const routes: Routes = [
  {
    path: '',
    component: DeliveryFigureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryFigureRoutingModule { }
