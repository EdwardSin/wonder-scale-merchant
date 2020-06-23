import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
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
import { ComponentmoduleproxyComponent } from './components/feature/proxy/componentmoduleproxy/componentmoduleproxy.component';
import { SharedModule } from './modules/public/shared/shared.module';

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
    // ContactUsComponent,
    // AboutUsComponent,
    MainComponent,
    MainContainerComponent,

    // Elements
    WsLeftNavComponent,
    BreadcrumbComponent,

    ComponentmoduleproxyComponent
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
