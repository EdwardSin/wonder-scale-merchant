import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesFigureComponent } from '@components/store/analysis/sales-figure/sales-figure.component';


const routes: Routes = [{
  path: '',
  component: SalesFigureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesFigureRoutingModule { }
