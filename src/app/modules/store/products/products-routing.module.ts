import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from '@components/store/products/products.component';


const routes: Routes = [{
  path: '',
  children: [
  { path: '', pathMatch: 'full', component: ProductsComponent},
  { path: 'all', loadChildren: () => import('./all-items/all-items.module').then(m => m.AllItemsModule), data: { title: 'all', breadcrumb: 'All' } },
  { path: 'custom/:name', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule), data: { title: 'custom', breadcrumb: '{{name}}' } }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
