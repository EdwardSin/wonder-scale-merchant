import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { MainComponent } from '@components/store/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { StoreResolver } from '@components/resolvers/store-resolver.service';
import { StoreGuard } from './guards/store.guard';
import { HomeControlComponent } from '@components/store/home-control/home-control.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'stores',
  loadChildren: () => import('./modules/store-list/store-list.module').then(m => m.StoreListModule)
}, {
  path: 'contact-us',
  loadChildren: () => import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule)
}, {
  path: 'policy',
  loadChildren: () => import('./modules/policy/policy.module').then(m => m.PolicyModule)
// temp remove package
// }, {
//   path: 'price',
//   loadChildren: () => import('./modules/price/price.module').then(m => m.PriceModule)
}, {
  path: 'stores/:username',
  component: MainComponent,
  canActivate: [AuthGuard],
  resolve: { store: StoreResolver },
  data: { title: 'username', breadcrumb: '{{username}}' },
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home',
      canActivate: [StoreGuard],
      data: { title: 'home', breadcrumb: 'Home' },
      component: HomeControlComponent
    },
    {
      path: 'analysis',
      canActivate: [StoreGuard],
      data: { title: 'analysis', breadcrumb: 'Analysis' },
      loadChildren: () => import('./modules/store/analysis/analysis.module').then(m => m.AnalysisModule)
    },
    {
      path: 'qrcode',
      canActivate: [StoreGuard],
      data: { title: 'qrcode', breadcrumb: 'QR code' },
      loadChildren: () => import('./modules/store/qrcode/qrcode.module').then(m => m.QrcodeModule)
    },
    {
      path: 'quick-menu',
      canActivate: [StoreGuard],
      data: { title: 'quick-menu', breadcrumb: 'Quick Menu' },
      loadChildren: () => import('./modules/store/quick-menu/quick-menu.module').then(m => m.QuickMenuModule)
    },
    {
      path: 'products',
      canActivate: [StoreGuard],
      data: { title: 'cat', breadcrumb: 'Products' },
      loadChildren: () => import('./modules/store/products/products.module').then(m => m.ProductsModule)
    },
    // {
    //   path: 'package',
    //   canActivate: [StoreGuard],
    //   data: { title: 'package', breadcrumb: 'Package' },
    //   loadChildren: () => import('./modules/store/package/package.module').then(m => m.PackageModule)
    // },
    {
      path: 'store-page',
      canActivate: [StoreGuard],
      data: { title: 'store-page', breadcrumb: 'Store page' },
      loadChildren: () => import('./modules/store/store-page/store-page.module').then(m => m.StorePageModule)
    },
    {
      path: 'invoices',
      canActivate: [StoreGuard],
      data: { title: 'invoices', breadcrumb: 'Invoices' },
      loadChildren: () => import('./modules/store/invoices/invoices.module').then(m => m.InvoicesModule)
    },
    {
      path: 'reviews',
      canActivate: [StoreGuard],
      data: { title: 'reviews', breadcrumb: 'Reviews' },
      loadChildren: () => import('./modules/store/reviews/reviews.module').then(m => m.ReviewsModule)
    },
    {
      path: 'on-selling-products',
      canActivate: [StoreGuard],
      data: { title: 'cat', breadcrumb: 'On Selling Products' },
      loadChildren: () => import('./modules/store/on-selling-products/on-selling-products.module').then(m => m.OnSellingProductsModule)
    },
    // {
    //   path: 'advertising',
    //   component: AdvertisingComponent,
    //   data: { title: 'advertising', breadcrumb: 'Advertising' }
    // },
    // {
    //   path: 'promotion',
    //   component: PromotionComponent,
    //   data: { title: 'promotion', breadcrumb: 'Promotion' }
    // },
    // {
    //   path: 'recruitment',
    //   component: RecruitmentComponent,
    //   data: { title: 'recruitment', breadcrumb: 'Recruitment' }
    // },
    // {
    //   path: 'reviews',
    //   component: ReviewsComponent,
    //   data: { title: 'review', breadcrumb: 'Review' },
    // },
    // {
    //   path: 'quotation',
    //   component: QuotationComponent,
    //   data: { title: 'quotation', breadcrumb: 'Quotation' }
    // },
    // {
    //   path: 'e-commerce',
    //   component: ECommerceComponent,
    //   data: { title: 'e-commerce', breadcrumb: 'E-Commerce' },
    //   children: [{ path: '', redirectTo: 'orders', pathMatch: 'full' },
    //   { path: 'orders', component: EOrdersComponent, data: { title: 'orders', breadcrumb: 'Orders' } },
    //   { path: 'items', component: EItemsComponent, data: { title: 'items', breadcrumb: 'Items' } },
    //   { path: 'delivery-methods', component: EDeliveryMethodsComponent, data: { title: 'delivery-methods', breadcrumb: 'Delivery Methods' } },
    //   { path: 'payment-methods', component: EPaymentMethodsComponent, data: { title: 'payment-methods', breadcrumb: 'Payment Methods' } },
    //   { path: 'billing-history', component: EBillingHistoryComponent, data: { title: 'billing-history', breadcrumb: 'Billing History' } }]
    // },
    {
      path: 'settings',
      canActivate: [StoreGuard],
      data: { title: 'settings', breadcrumb: 'Settings' },
      loadChildren: () => import('./modules/store/settings/settings.module').then(m => m.SettingsModule)
    }
  ]
},
{ path: 'not-found', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) },
{
  path: '**',
  redirectTo: 'not-found'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
