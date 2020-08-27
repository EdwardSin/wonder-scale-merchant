import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { MainComponent } from '@components/shop/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { ShopResolver } from '@components/resolvers/shopResolver.service';
import { ShopGuard } from './shop.guard';
import { BillingComponent } from '@components/shop/billing/billing/billing.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'shops',
  loadChildren: () => import('./modules/shop-list/shop-list.module').then(m => m.ShopListModule)
}, {
  path: 'contact-us',
  loadChildren: () => import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule)
}, {
  path: 'policy',
  loadChildren: () => import('./modules/policy/policy.module').then(m => m.PolicyModule)
}, {
  path: 'shops/:username',
  component: MainComponent,
  canActivate: [AuthGuard],
  resolve: { shop: ShopResolver },
  data: { title: 'username', breadcrumb: '{{username}}' },
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
      path: 'dashboard',
      canActivate: [ShopGuard],
      data: { title: 'dashboard', breadcrumb: 'Dashboard' },
      loadChildren: () => import('./modules/shop/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
      path: 'quick-menu',
      canActivate: [ShopGuard],
      data: { title: 'quick-menu', breadcrumb: 'Quick Menu' },
      loadChildren: () => import('./modules/shop/quick-menu/quick-menu.module').then(m => m.QuickMenuModule)
    },
    {
      path: 'catalogue',
      canActivate: [ShopGuard],
      data: { title: 'cat', breadcrumb: 'Catalogue' },
      loadChildren: () => import('./modules/shop/catalogue/catalogue.module').then(m => m.CatalogueModule)
    },
    {
      path: 'information',
      canActivate: [ShopGuard],
      data: { title: 'information', breadcrumb: 'Information' },
      loadChildren: () => import('./modules/shop/information/information.module').then(m => m.InformationModule)
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
      path: 'packages',
      data: { title: 'packages', breadcrumb: 'Packages' },
      loadChildren: () => import('./modules/shop/packages/packages.module').then(m => m.PackagesModule)
    },
    {
      path: 'billing',
      canActivate: [ShopGuard],
      data: { title: 'billing', breadcrumb: 'Billing' },
      loadChildren: () => import('./modules/shop/billing/billing.module').then(m => m.BillingModule)
    },
    {
      path: 'settings',
      canActivate: [ShopGuard],
      data: { title: 'settings', breadcrumb: 'Settings' },
      loadChildren: () => import('./modules/shop/settings/settings.module').then(m => m.SettingsModule)
    },
    {
      path: 'qrcode',
      canActivate: [ShopGuard],
      data: { title: 'qrcode', breadcrumb: 'Qr Code' },
      loadChildren: () => import('./modules/shop/qrcode/qrcode.module').then(m => m.QrcodeModule)
    },
    {
      path: 'ordering',
      canActivate: [ShopGuard],
      data: { title: 'ordering', breadcrumb: 'Ordering'},
      loadChildren: () => import('./modules/shop/ordering/ordering.module').then(m => m.OrderingModule)
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
