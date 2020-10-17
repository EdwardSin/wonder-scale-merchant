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
      path: 'tracking',
      canActivate: [StoreGuard],
      data: { title: 'tracking', breadcrumb: 'Tracking' },
      loadChildren: () => import('./modules/store/tracking/tracking.module').then(m => m.TrackingModule)
    },
    {
      path: 'quick-menu',
      canActivate: [StoreGuard],
      data: { title: 'quick-menu', breadcrumb: 'Quick Menu' },
      loadChildren: () => import('./modules/store/quick-menu/quick-menu.module').then(m => m.QuickMenuModule)
    },
    {
      path: 'catalogue',
      canActivate: [StoreGuard],
      data: { title: 'cat', breadcrumb: 'Catalogue' },
      loadChildren: () => import('./modules/store/catalogue/catalogue.module').then(m => m.CatalogueModule)
    },
    {
      path: 'information',
      canActivate: [StoreGuard],
      data: { title: 'information', breadcrumb: 'Information' },
      loadChildren: () => import('./modules/store/information/information.module').then(m => m.InformationModule)
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
