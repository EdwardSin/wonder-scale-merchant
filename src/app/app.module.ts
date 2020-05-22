import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/public/home/home.component';
import { HeaderComponent } from './partials/header/header.component';
import { ContactUsComponent } from './components/public/contact-us/contact-us.component';
import { WsLoadingButtonComponent } from './elements/ws-loading-button/ws-loading-button.component';
import { WsLoadingComponent } from './elements/ws-loading/ws-loading.component';
import { WsSpinnerComponent } from './elements/ws-spinner-styles/ws-spinner/ws-spinner.component';
import { WsSpinnerBarComponent } from './elements/ws-spinner-styles/ws-spinner-bar/ws-spinner-bar.component';
import { WsSpinnerDotComponent } from './elements/ws-spinner-styles/ws-spinner-dot/ws-spinner-dot.component';
import { WsSpinnerHDotComponent } from './elements/ws-spinner-styles/ws-spinner-h-dot/ws-spinner-h-dot.component';
import { LoginComponent } from './components/feature/authentication/login/login.component';
import { RegisterComponent } from './components/feature/authentication/register/register.component';
import { ForgotPasswordComponent } from './components/feature/authentication/forgot-password/forgot-password.component';
import { ActivateComponent } from './components/feature/authentication/activate/activate.component';
import { ResetPasswordComponent } from './components/feature/authentication/reset-password/reset-password.component';
import { AboutUsComponent } from '@components/public/about-us/about-us.component';
import { ModalDirective } from './directives/modal.directive';
import { ClickoutsideDirective } from './directives/clickoutside.directive';
import { ShopListComponent } from '@components/shop-list/shop-list.component';
import { AllShopsComponent } from '@components/shop-list/all-shops/all-shops.component';
import { AllItemsComponent } from '@components/shop/catalogue/all-items/all-items.component';
import { PendingShopsComponent } from '@components/shop-list/pending-shops/pending-shops.component';
import { ShopListControllerComponent } from '@components/shop-list/shop-list-controller/shop-list-controller.component';
import { ActiveShopComponent } from '@components/shop-list/active-shop/active-shop.component';
import { PendingShopComponent } from '@components/shop-list/pending-shop/pending-shop.component';
import { WsPassDatePipe } from './pipes/ws-pass-date.pipe';
import { WsCurrencyPipe } from './pipes/ws-currency.pipe';
import { ConfirmModalComponent } from '@components/modals/confirm-modal/confirm-modal.component';
import { ItemViewComponent } from '@components/shop/catalogue/item-view/item-view.component';
import { ItemControllerComponent } from '@components/shop/catalogue/item-controller/item-controller.component';
import { DiscountItemsComponent } from '@components/shop/catalogue/discount-items/discount-items.component';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { SearchBarComponent } from '@elements/search-bar/search-bar.component';
import { AddToCategoriesModalComponent } from '@components/modals/add-to-categories-modal/add-to-categories-modal.component';
import { MoveToCategoriesModalComponent } from '@components/modals/move-to-categories-modal/move-to-categories-modal.component';
import { EditMultipleItemsModalComponent } from '@components/modals/edit-multiple-items-modal/edit-multiple-items-modal.component';
import { WsLimitCtrlPipe } from './pipes/ws-limit-ctrl.pipe';
import { CreateShopComponent } from '@components/shop/create-shop/create-shop.component';
import { BusinessLocationComponent } from '@elements/business-location/business-location.component';
import { BusinessTimetableComponent } from '@elements/business-timetable/business-timetable.component';
import { InformationComponent } from '@components/shop/information/information.component';
import { ItemsComponent } from '@components/shop/catalogue/items/items.component';
import { UncategorizedItemsComponent } from '@components/shop/catalogue/uncategorized-items/uncategorized-items.component';
import { UnpublishedItemsComponent } from '@components/shop/catalogue/unpublished-items/unpublished-items.component';
import { PublishedItemsComponent } from '@components/shop/catalogue/published-items/published-items.component';
import { NewItemsComponent } from '@components/shop/catalogue/new-items/new-items.component';
import { CatalogueComponent } from '@components/shop/catalogue/catalogue.component';
import { isPlatformBrowser } from '@angular/common';
import { MainComponent } from '@components/shop/main/main.component';
import { MainContainerComponent } from '@components/shop/main/main-container/main-container.component';
import { SettingsComponent } from '@components/shop/settings/settings/settings.component';
import { AboutComponent } from '@components/shop/settings/about/about.component';
import { SocialMediaComponent } from '@components/shop/settings/social-media/social-media.component';
import { QrcodeComponent } from '@components/shop/qrcode/qrcode.component';
import { ErrorComponent } from '@components/public/error/error.component';
import { WsLeftNavComponent } from '@elements/ws-left-nav/ws-left-nav.component';
import { BreadcrumbComponent } from '@elements/breadcrumb/breadcrumb.component';
import { ImportItemsModalComponent } from '@components/modals/import-items-modal/import-items-modal.component';
import { WsMultipleInputComponent } from '@elements/ws-multiple-input/ws-multiple-input.component';
import { PermissionListComponent } from '@elements/permission-list/permission-list.component';
import { EditContributorModalComponent } from '@components/modals/edit-contributor-modal/edit-contributor-modal.component';
import { WsToastComponent } from '@elements/ws-toast/ws-toast.component';
import { WsLoadingScreenComponent } from '@elements/ws-loading-screen/ws-loading-screen.component';
import { ModifyItemComponent } from '@components/shop/catalogue/modify-item/modify-item.component';
import { WsDropdownComponent } from '@elements/ws-dropdown/ws-dropdown.component';
import { WsDiscountconverterPipe } from './pipes/ws-discountconverter.pipe';
import { WsUploaderComponent } from './elements/ws-uploader/ws-uploader.component';
import { WsPaginationComponent } from './elements/ws-pagination/ws-pagination.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { ModifyItemTypeComponent } from './components/shop/catalogue/modify-item-type/modify-item-type.component';
export function jwtOptionsFactory(platformId) {
  return {
    tokenGetter: () => {
      let token = null;
      if (isPlatformBrowser(platformId)) {
        token = sessionStorage.getItem('token');
      }
      return token;
    },
    whitelistedDomains: ['localhost:4000/users', 'localhost:9005/users', 'wonderscale.com/users']
  };
}
export function provideConfig() {
  var config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("783575719474-mbhan9e6d0ucn4j3c6t847udbvtbc8aq.apps.googleusercontent.com")
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("246047829574930")
    }
  ]);
  return config;
}

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ContactUsComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ActivateComponent,
    RegisterComponent,
    ResetPasswordComponent,
    AboutUsComponent,
    MainComponent,
    MainContainerComponent,
    ShopListComponent,
    AllShopsComponent,
    PendingShopComponent,
    PendingShopsComponent,
    ActiveShopComponent,
    AllItemsComponent,
    ShopListControllerComponent,
    DiscountItemsComponent,
    ItemControllerComponent,
    ItemViewComponent,
    CreateShopComponent,
    InformationComponent,
    ItemsComponent,
    UncategorizedItemsComponent,
    UnpublishedItemsComponent,
    PublishedItemsComponent,
    NewItemsComponent,
    CatalogueComponent,
    SettingsComponent,
    AboutComponent,
    SocialMediaComponent,
    QrcodeComponent,
    ModifyItemComponent,
    WsDropdownComponent,
    ErrorComponent,

    // Pipes
    WsPassDatePipe,
    WsCurrencyPipe,
    WsDiscountconverterPipe,
    WsLimitCtrlPipe,

    // Directives
    ModalDirective,
    ClickoutsideDirective,
    AutofocusDirective,
    DebounceClickDirective,

    // Elements
    WsLoadingComponent,
    WsLoadingScreenComponent,
    WsLoadingButtonComponent,
    WsSpinnerComponent,
    WsSpinnerBarComponent,
    WsSpinnerDotComponent,
    WsSpinnerHDotComponent,
    WsLeftNavComponent,
    WsMultipleInputComponent,
    WsModalComponent,
    WsToastComponent,
    BreadcrumbComponent,
    SearchBarComponent,
    PermissionListComponent,
    BusinessLocationComponent,
    BusinessTimetableComponent,
    WsUploaderComponent,
    WsPaginationComponent,
    
    // Modals
    AddToCategoriesModalComponent,
    ConfirmModalComponent,
    EditMultipleItemsModalComponent,
    MoveToCategoriesModalComponent,
    ImportItemsModalComponent,
    EditContributorModalComponent,
    ModifyItemTypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    DragDropModule,
    LazyLoadImageModule,
    SocialLoginModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBTVuemjzI8vqXoCPeJhtt0WgFQ9TNizLQ'
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID]
      }
    })
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
