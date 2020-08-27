import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SocialLoginModule, GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SortablejsModule } from 'ngx-sortablejs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/public/home/home.component';
import { HeaderComponent } from './partials/header/header.component';
// import { ContactUsComponent } from './components/public/contact-us/contact-us.component';
// import { AboutUsComponent } from '@components/public/about-us/about-us.component';

import { isPlatformBrowser } from '@angular/common';
import { MainComponent } from '@components/shop/main/main.component';
import { MainContainerComponent } from '@components/shop/main/main-container/main-container.component';
import { WsLeftNavComponent } from '@elements/ws-left-nav/ws-left-nav.component';
import { BreadcrumbComponent } from '@elements/breadcrumb/breadcrumb.component';
import { SharedModule } from './modules/public/shared/shared.module';
import { BillingComponent } from './components/shop/billing/billing/billing.component';
import { HistoryComponent } from './components/shop/billing/history/history.component';
import { PaymentMethodsComponent } from './components/shop/billing/payment-methods/payment-methods.component';
import { SubscriptionComponent } from './components/shop/billing/subscription/subscription.component';
import { ModifyMenuItemComponent } from './components/shop/catalogue/modify-menu-item/modify-menu-item.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  observer: true,
  observeParents: true,
  pagination: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

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

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HomeComponent,
    HeaderComponent,
    // ContactUsComponent,
    // AboutUsComponent,
    MainComponent,
    MainContainerComponent,

    // Elements
    WsLeftNavComponent,
    BreadcrumbComponent,
    BillingComponent,
    HistoryComponent,
    PaymentMethodsComponent,
    SubscriptionComponent,
    ModifyMenuItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    SocialLoginModule,
    NgProgressModule,
    NgProgressRouterModule,
    NgxDropzoneModule,
    SortablejsModule.forRoot({
      animation: 150
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
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("783575719474-mbhan9e6d0ucn4j3c6t847udbvtbc8aq.apps.googleusercontent.com")
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("246047829574930")
          }
        ]
      } as SocialAuthServiceConfig
    },
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
