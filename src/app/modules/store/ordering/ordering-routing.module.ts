import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderingComponent } from '@components/store/ordering/ordering.component';


const routes: Routes = [{
  path: '',
  component: OrderingComponent,
  children: [{ path: '', redirectTo: 'tables', pathMatch: 'full' },
  { 
    path: 'tables',
    loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
    data: { title: 'tables', breadcrumb: 'Tables' }
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
    data: { title: 'sales', breadcrumb: 'Sales' }
  },
  {
    path: 'statements',
    loadChildren: () => import('./statements/statements.module').then(m => m.StatementsModule),
    data: { title: 'statements', breadcrumb: 'Statements' }
  },
  {
    path: 'configurations',
    loadChildren: () => import('./ordering-configurations/ordering-configurations.module').then(m => m.OrderingConfigurationsModule),
    data: { title: 'configurations', breadcrumb: 'Configurations' }
  }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderingRoutingModule { }
