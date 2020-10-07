import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '@services/general/screen.service';
import { VisitorGuard } from 'src/app/guards/visitor.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;
  isMobileSize;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private visitorGuard: VisitorGuard,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private screenService: ScreenService,
    private authUserService: AuthUserService,
    private authenticationService: AuthenticationService,
    private sharedStoreService: SharedStoreService,
    private sharedLoadingService: SharedLoadingService,
    private sharedUserService: SharedUserService) { }
  ngOnInit() {
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.user = result;
      })
    this.authenticationService.isAuthenticated().then(result => {
      if (result) {
        this.getUser();
      }
    });
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(queryParams => {
      let isModal = queryParams['modal'];
      if (isModal && this.isAuthenticateUrl(isModal)) {
        this.visitorGuard.canActivate().then(result => {
          if (result) {
            if (isModal == 'login') {
              this.createLazyLoginComponent();
            } else if (isModal == 'register') {
              this.createLazyRegisterComponent();
            } else if (isModal == 'forgot-password') {
              this.createLazyForgotPasswordComponent();
            } else if (isModal == 'activate') {
              this.createLazyActivateComponent();
            } else if (isModal == 'reset-password') {
              this.createLazyResetPasswordComponent();
            }
          } else {
            this.getUser();
            this.router.navigate([], {queryParams: {modal: null}});
          }
        })
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if(result) {
          this.sharedUserService.user.next(result.result);
        }
      })
  }
  isAuthenticateUrl(url) {
    return url =='login' || url == 'register' || url == 'forgot-password' || url == 'activate' || url == 'reset-password';
  }
  async createLazyLoginComponent() {
    this.viewContainerRef.clear();
    await import ('../../modules/authentication/login/login.module');
    const { LoginComponent } = await import('@components/feature/authentication/login/login.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(LoginComponent));
  }
  async createLazyRegisterComponent() {
    this.viewContainerRef.clear();
    await import('../../modules/authentication/register/register.module');
    const { RegisterComponent } = await import('@components/feature/authentication/register/register.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(RegisterComponent));
  }
  async createLazyForgotPasswordComponent() {
    this.viewContainerRef.clear();
    await import('../../modules/authentication/forgot-password/forgot-password.module');
    const { ForgotPasswordComponent } = await import('@components/feature/authentication/forgot-password/forgot-password.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ForgotPasswordComponent));
  }
  async createLazyActivateComponent() {
    this.viewContainerRef.clear();
    await import('../../modules/authentication/activate/activate.module');
    const { ActivateComponent } = await import('@components/feature/authentication/activate/activate.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ActivateComponent));
  }
  async createLazyResetPasswordComponent() {
    this.viewContainerRef.clear();
    await import('../../modules/authentication/reset-password/reset-password.module');
    const { ResetPasswordComponent } = await import('@components/feature/authentication/reset-password/reset-password.component');
    this.viewContainerRef.createComponent(this.cfr.resolveComponentFactory(ResetPasswordComponent));
  }
  navigateToHome() {
    this.router.navigate(['/stores/all']);
    this.sharedStoreService.store.next(null);
  }
  displayPreview() {

  }
  logout() {
    this.sharedLoadingService.screenLoading.next({loading: true, label: 'Logging out...'});
    this.authenticationService.logout().then(result => {
      setTimeout(() => {
        this.sharedLoadingService.screenLoading.next({loading: false});
        this.router.navigate(['']);
        this.sharedStoreService.store.next(null);
      }, 500);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
