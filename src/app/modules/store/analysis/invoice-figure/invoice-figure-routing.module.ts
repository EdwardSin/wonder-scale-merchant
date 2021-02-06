import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceFigureComponent } from '@components/store/analysis/invoice-figure/invoice-figure.component';


const routes: Routes = [{
  path: '',
  component: InvoiceFigureComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceFigureRoutingModule { }
