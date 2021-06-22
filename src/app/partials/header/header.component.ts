import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { of, Subject, timer } from 'rxjs';
import { debounceTime, finalize, delay, switchMap, takeUntil } from 'rxjs/operators';
import { ScreenService } from '@services/general/screen.service';
import { VisitorGuard } from 'src/app/guards/visitor.guard';
import { environment } from '@environments/environment';
import { NotificationMessage } from '@objects/notification-message';
import { AuthNotificationUserService } from '@services/http/auth-user/auth-notification-user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;
  environment = environment;
  moment = moment;
  isMobileSize;
  isNotificationDropdown: boolean;
  notificationLoading: WsLoading = new WsLoading();
  notificationLazyLoading: WsLoading = new WsLoading();
  numberOfNewNotifications: number = 0;
  totalOfNotification: number = 20;
  offsetOfNotification: number = 0;
  updatedAt = new Date;
  notifications: Array<NotificationMessage> = [];
  checkNotificationSubscription;
  REFRESHER_NOTIFICATIONS_INTERVAL = 30 * 1000;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private visitorGuard: VisitorGuard,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver,
    private screenService: ScreenService,
    private authUserService: AuthUserService,
    private authenticationService: AuthenticationService,
    private authNotificationUserService: AuthNotificationUserService,
    private sharedStoreService: SharedStoreService,
    private sharedLoadingService: SharedLoadingService,
    private sharedUserService: SharedUserService) { }
  ngOnInit() {
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.user = result;
        if (result) {
          this.getNotifications();
          this.checkNotifications();
        }
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
          // temp disable sse
          // this.setupNotificationStream();
        }
      })
  }
  isAuthenticateUrl(url) {
    return url =='login' || url == 'register' || url == 'forgot-password' || url == 'activate' || url == 'reset-password';
  }
  // temp disable sse
  // currentStream;
  // setupNotificationStream(delaySeconds=0) {
  //   if (this.currentStream) {
  //     this.currentStream.unsubscribe();
  //   }
  //   this.currentStream = of('init').pipe(delay(delaySeconds), switchMap(() => {
  //       return this.authNotificationUserService.getNotificationStream()
  //     }), switchMap((result) => {
  //     if (result['data'] === 'true') {
  //       return this.authNotificationUserService.getNotifications();
  //     }
  //     return of(null);
  //   }), takeUntil(this.ngUnsubscribe)).subscribe(result => {
  //     if (result) {
  //       this.notifications = [...result['result']];
  //       this.numberOfNewNotifications = result['meta']['isNewItem'];
  //     }
  //   }, err => {
  //     this.setupNotificationStream(30000);
  //   });
  // }
  checkNotifications() {
    if (this.checkNotificationSubscription) {
      this.checkNotificationSubscription.unsubscribe();
    }
    this.checkNotificationSubscription = timer(5000, this.REFRESHER_NOTIFICATIONS_INTERVAL).pipe(
      switchMap(() => {
        let obj = { updatedAt: this.updatedAt };
        return this.authNotificationUserService.checkNotifications(obj)}),
      takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result['result'] && result['result'].notification) {
        this.updatedAt = result['result'].notification;
        this.getNotifications();
      }
    }, err => {
      this.checkNotifications();
    });
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
  openNotificationDropdown() {
    this.isNotificationDropdown = true;
    this.getNotifications();
  }
  getNotifications(event?) {
    if (event) {
      this.notificationLazyLoading.start();
      this.authNotificationUserService.getNotifications().pipe(debounceTime(500), takeUntil(this.ngUnsubscribe), finalize(() => this.notificationLazyLoading.stop())).subscribe(result => {
        this.notifications = [...result['result']];
        this.numberOfNewNotifications = result['meta']['isNewItem'];
      });
    }
    if (event === undefined) {
      this.notificationLoading.start();
      this.authNotificationUserService.getNotifications().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.notificationLoading.stop())).subscribe(result => {
        this.notifications = [...result['result']];
        this.numberOfNewNotifications = result['meta']['isNewItem'];
      });
    }
  }
  loadedNewNotifications() {
    if (this.isNotificationDropdown) {
      this.isNotificationDropdown = false;
      let notifications = this.notifications.filter(result => {
        return result['isNewItem'];
      }).map(result => {
        return result['_id'];
      });
      this.authNotificationUserService.loadedNewNotifications(notifications).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.numberOfNewNotifications = 0;
      });
    }
  }
  navigateToPaidInvoice(notification) {
    this.loadedNewNotifications();
    this.isNotificationDropdown = false;
    this.authNotificationUserService.readNotification(notification?._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      notification.isRead = true;
    });
    this.router.navigate(['/stores', notification?.fromStore?.username, 'invoices', 'all-invoices'], {queryParams: {invoiceId: notification?.data?.invoiceId, paid: true, tab: 'paid'}, queryParamsHandling: 'merge'});
  }
  navigateToInvoice(notification) {
    this.loadedNewNotifications();
    this.isNotificationDropdown = false;
    this.authNotificationUserService.readNotification(notification?._id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      notification.isRead = true;
    });
    this.router.navigate(['/stores', notification?.fromStore?.username, 'invoices', 'all-invoices'], {queryParams: {invoiceId: notification?.data?.invoiceId, tab: 'wait_for_approval'}, queryParamsHandling: 'merge'});
  }
  navigateToHome() {
    this.router.navigate(['/stores/all']);
    this.sharedStoreService.store.next(null);
  }
  logout() {
    this.sharedLoadingService.screenLoading.next({loading: true, label: 'Logging out...'});
    this.authenticationService.logout().then(result => {
      setTimeout(() => {
        this.sharedLoadingService.screenLoading.next({loading: false});
        this.router.navigate(['']);
        this.sharedStoreService.store.next(null);
        if (this.checkNotificationSubscription) {
          this.checkNotificationSubscription.unsubscribe();
        }
      }, 500);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
