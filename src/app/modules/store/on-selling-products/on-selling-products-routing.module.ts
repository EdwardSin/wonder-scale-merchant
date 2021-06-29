import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnSellingProductsComponent } from '@components/store/on-selling-products/on-selling-products.component';


const routes: Routes = [{
  path: '',
  children: [
  { path: '', pathMatch: 'full', component: OnSellingProductsComponent},{ path: 'custom/:name', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule), data: { title: 'custom', breadcrumb: '{{name}}' } }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnSellingProductsRoutingModule { }
