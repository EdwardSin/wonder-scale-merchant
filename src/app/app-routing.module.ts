import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { VisitorGuard } from './guards/visitor.guard';
import { MainComponent } from '@components/shop/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { ShopResolver } from '@components/resolvers/shopResolver.service';
import { ShopGuard } from './shop.guard';
import { ComponentmoduleproxyComponent } from '@components/feature/proxy/componentmoduleproxy/componentmoduleproxy.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'shops',
  loadChildren: () => import('./modules/shop-list/shop-list.module').then(m => m.ShopListModule)
  // }, {
  //   path: 'contact-us',
  //   component: ContactUsComponent
  // }, {
  //   path: 'about-us',
  //   component: AboutUsComponent
}, {
  path: 'login',
  canActivate: [VisitorGuard],
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/authentication/login/login.module').then(m => m.LoginModule)
    }
  ]
},
{
  path: 'activate/:token',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/authentication/activate/activate.module').then(m => m.ActivateModule)
    }
  ]
}, {
  path: 'register',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/authentication/register/register.module').then(m => m.RegisterModule)
    }
  ]
}, {
  path: 'forgot-password',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/authentication/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
    }
  ]
}, {
  path: 'reset-password/:token',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/authentication/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
    }
  ]
}, {
  path: 'item',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  data: { title: 'cat', breadcrumb: 'Catalogue' },
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/shop/catalogue/modify-item/modify-item.module').then(m => m.ModifyItemModule)
    }
  ]
}, {
  path: 'item-types',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  data: { title: 'cat', breadcrumb: 'Catalogue' },
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/shop/catalogue/modify-item-type/modify-item-type.module').then(m => m.ModifyItemTypeModule)
    }
  ]
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
      loadChildren: () => import('./modules/shop/dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [ShopGuard],
      data: { title: 'dashboard', breadcrumb: 'Dashboard' }
    },
    {
      path: 'catalogue',
      loadChildren: () => import('./modules/shop/catalogue/catalogue.module').then(m => m.CatalogueModule),
      canActivate: [ShopGuard],
      data: { title: 'cat', breadcrumb: 'Catalogue' }
    },
    {
      path: 'information',
      canActivate: [ShopGuard],
      loadChildren: () => import('./modules/shop/information/information.module').then(m => m.InformationModule),
      data: { title: 'information', breadcrumb: 'Information' }
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
    // {
    //   path: 'features',
    //   component: FeaturesComponent,
    //   data: { title: 'features', breadcrumb: 'Features' }
    // },
    // {
    //   path: 'billing',
    //   component: BillingComponent,
    //   data: { title: 'billing', breadcrumb: 'Billing' },
    //   children: [{ path: '', redirectTo: 'history', pathMatch: 'full' },
    //   { path: 'history', component: HistoryComponent, data: { title: 'history', breadcrumb: 'History' } },
    //   { path: 'payment-methods', component: PaymentMethodsComponent, data: { title: 'payment-methods', breadcrumb: 'Payment Methods' } },
    //   { path: 'subscription', component: SubscriptionComponent, data: { title: 'subscription', breadcrumb: 'Subscription' } }]
    // },
    {
      path: 'settings',
      canActivate: [ShopGuard],
      loadChildren: () => import('./modules/shop/settings/settings.module').then(m => m.SettingsModule),
      // component: SettingsComponent,
      data: { title: 'settings', breadcrumb: 'Settings' }
    },
    {
      path: 'qrcode',
      canActivate: [ShopGuard],
      data: { title: 'qrcode', breadcrumb: 'Qr Code' },
      loadChildren: () => import('./modules/shop/qrcode/qrcode.module').then(m => m.QrcodeModule)
    },
  ]
},
{ path: 'not-found', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) },
{
  path: 'new-shop',
  outlet: 'modal',
  component: ComponentmoduleproxyComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./modules/create-shop/create-shop.module').then(m => m.CreateShopModule)
    }
  ]
}
  , {
  path: '**',
  redirectTo: 'not-found'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
