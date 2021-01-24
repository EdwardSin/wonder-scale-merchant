import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalysisComponent } from '@components/store/analysis/analysis.component';


const routes: Routes = [{
  path: '',
  component: AnalysisComponent,
  children: [
    { path: '', redirectTo: 'general', pathMatch: 'full'},
    {
      path: 'general',
      data: { title: 'general', breadcrumb: 'General' },
      loadChildren: () => import('./general-figure/general-figure.module').then(m => m.GeneralFigureModule)
    },
    {
      path: 'sales',
      data: { title: 'sales', breadcrumb: 'Sales' },
      loadChildren: () => import('./sales-figure/sales-figure.module').then(m => m.SalesFigureModule)
    },
    {
      path: 'pageview',
      data: { title: 'pageview', breadcrumb: 'Page View' },
      loadChildren: () => import('./pageview-figure/pageview-figure.module').then(m => m.PageviewFigureModule)
    },
    {
      path: 'delivery',
      data: { title: 'delivery', breadcrumb: 'Delivery' },
      loadChildren: () => import('./delivery-figure/delivery-figure.module').then(m => m.DeliveryFigureModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule { }
