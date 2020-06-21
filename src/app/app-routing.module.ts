import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/public/home/home.component';
import { ContactUsComponent } from './components/public/contact-us/contact-us.component';
import { AboutUsComponent } from './components/public/about-us/about-us.component';
import { LoginComponent } from './components/feature/authentication/login/login.component';
import { ActivateComponent } from './components/feature/authentication/activate/activate.component';
import { RegisterComponent } from './components/feature/authentication/register/register.component';
import { ForgotPasswordComponent } from './components/feature/authentication/forgot-password/forgot-password.component';
import { VisitorGuard } from './guards/visitor.guard';
import { ShopListComponent } from '@components/shop-list/shop-list.component';
import { AllShopsComponent } from '@components/shop-list/all-shops/all-shops.component';
import { PendingShopsComponent } from '@components/shop-list/pending-shops/pending-shops.component';
import { CreateShopComponent } from '@components/shop/create-shop/create-shop.component';
import { MainComponent } from '@components/shop/main/main.component';
import { ErrorComponent } from '@components/public/error/error.component';
import { QrcodeComponent } from '@components/shop/qrcode/qrcode.component';
import { SocialMediaComponent } from '@components/shop/settings/social-media/social-media.component';
import { AboutComponent } from '@components/shop/settings/about/about.component';
import { SettingsComponent } from '@components/shop/settings/settings/settings.component';
import { InformationComponent } from '@components/shop/information/information.component';
import { ItemsComponent } from '@components/shop/catalogue/items/items.component';
import { UncategorizedItemsComponent } from '@components/shop/catalogue/uncategorized-items/uncategorized-items.component';
import { UnpublishedItemsComponent } from '@components/shop/catalogue/unpublished-items/unpublished-items.component';
import { PublishedItemsComponent } from '@components/shop/catalogue/published-items/published-items.component';
import { DiscountItemsComponent } from '@components/shop/catalogue/discount-items/discount-items.component';
import { NewItemsComponent } from '@components/shop/catalogue/new-items/new-items.component';
import { AllItemsComponent } from '@components/shop/catalogue/all-items/all-items.component';
import { CatalogueComponent } from '@components/shop/catalogue/catalogue.component';
import { AuthGuard } from './guards/auth.guard';
import { ShopResolver } from '@components/resolvers/shopResolver.service';
import { ResetPasswordComponent } from '@components/feature/authentication/reset-password/reset-password.component';
import { ModifyItemComponent } from '@components/shop/catalogue/modify-item/modify-item.component';
import { ModifyItemTypeComponent } from '@components/shop/catalogue/modify-item-type/modify-item-type.component';
import { ShopGuard } from './shop.guard';
import { TodaySpecialItemsComponent } from '@components/shop/catalogue/today-special-items/today-special-items.component';
import { DashboardComponent } from '@components/shop/dashboard/dashboard.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'shops',
  component: ShopListComponent,
  canActivate: [AuthGuard],
  children: [{ path: '', redirectTo: 'all', pathMatch: 'full', },
  { path: 'all', component: AllShopsComponent },
  { path: 'pending', component: PendingShopsComponent }
  ]
}, {
  path: 'new-shop',
    component: CreateShopComponent,
    outlet: 'modal'
}, {
  path: 'contact-us',
  component: ContactUsComponent
}, {
  path: 'about-us',
  component: AboutUsComponent
}, {
  path: 'login',
  component: LoginComponent,
  canActivate: [VisitorGuard],
  outlet: 'modal'
}, {
  path: 'activate/:token',
  component: ActivateComponent,
  outlet: 'modal'
}, {
  path: 'register',
  component: RegisterComponent,
  outlet: 'modal'
}, {
  path: 'forgot-password',
  component: ForgotPasswordComponent,
  outlet: 'modal'
}, {
  path: 'reset-password/:token',
  component: ResetPasswordComponent,
  outlet: 'modal'
}, {
  path: 'item',
  component: ModifyItemComponent,
  outlet: 'modal'
}, {
  path: 'item-types',
  component: ModifyItemTypeComponent,
  outlet: 'modal'
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
      component: DashboardComponent,
      canActivate: [ShopGuard],
      data: {title: 'dashboard', breadcrumb: 'Dashboard'}
    },
    {
      path: 'catalogue',
      component: CatalogueComponent,
      canActivate: [ShopGuard],
      data: { title: 'cat', breadcrumb: 'Catalogue' },
      children: [{ path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: AllItemsComponent, data: { title: 'all', breadcrumb: 'All' } },
      { path: 'new', component: NewItemsComponent, data: { title: 'new', breadcrumb: 'New' } },
      { path: 'todayspecial', component: TodaySpecialItemsComponent, data: { title: 'todayspecial', breadcrumb: 'Today Special' } },
      { path: 'discount', component: DiscountItemsComponent, data: { title: 'discount', breadcrumb: 'Discount' } },
      { path: 'published', component: PublishedItemsComponent, data: { title: 'published', breadcrumb: 'Published' } },
      { path: 'unpublished', component: UnpublishedItemsComponent, data: { title: 'unpublished', breadcrumb: 'Unpublished' } },
      { path: 'uncategorized', component: UncategorizedItemsComponent, data: { title: 'uncategorized', breadcrumb: 'Uncategorized' } },
      { path: 'custom/:name', component: ItemsComponent, data: { title: 'custom', breadcrumb: '{{name}}' } }
      ]
    },
    {
      path: 'information',
      canActivate: [ShopGuard],
      component: InformationComponent,
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
      component: SettingsComponent,
      data: { title: 'settings', breadcrumb: 'Settings' },
      children: [{
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
      },
      {
        path: 'about',
        component: AboutComponent,
        resolve: { shop: ShopResolver },
        data: { title: 'about', breadcrumb: 'About' }
      },
      {
        path: 'social-media',
        component: SocialMediaComponent,
        resolve: { shop: ShopResolver },
        data: { title: 'social-media', breadcrumb: 'Socia Media' }
      }
      ]
    },
    {
      path: 'qrcode',
      canActivate: [ShopGuard],
      component: QrcodeComponent,
      data: { title: 'qrcode', breadcrumb: 'Qr Code' }
    }, {
      path: 'not-found', component: ErrorComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
