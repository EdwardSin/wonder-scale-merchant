import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueComponent } from '@components/shop/catalogue/catalogue.component';


const routes: Routes = [{
  path: '',
  component: CatalogueComponent,
  children: [{ path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', loadChildren: () => import('./all-items/all-items.module').then(m => m.AllItemsModule), data: { title: 'all', breadcrumb: 'All' } },
  { path: 'new', loadChildren: () => import('./new-items/new-items.module').then(m => m.NewItemsModule), data: { title: 'new', breadcrumb: 'New' } },
  { path: 'todayspecial', loadChildren: () => import('./today-special-items/today-special-items.module').then(m => m.TodaySpecialItemsModule), data: { title: 'todayspecial', breadcrumb: 'Today Special' } },
  { path: 'discount', loadChildren: () => import('./discount-items/discount-items.module').then(m => m.DiscountItemsModule), data: { title: 'discount', breadcrumb: 'Discount' } },
  { path: 'published', loadChildren: () => import('./published-items/published-items.module').then(m => m.PublishedItemsModule), data: { title: 'published', breadcrumb: 'Published' } },
  { path: 'unpublished', loadChildren: () => import('./unpublished-items/unpublished-items.module').then(m => m.UnpublishedItemsModule), data: { title: 'unpublished', breadcrumb: 'Unpublished' } },
  { path: 'uncategorized', loadChildren: () => import('./uncategorized-items/uncategorized-items.module').then(m => m.UncategorizedItemsModule), data: { title: 'uncategorized', breadcrumb: 'Uncategorized' } },
  { path: 'custom/:name', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule), data: { title: 'custom', breadcrumb: '{{name}}' } }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
