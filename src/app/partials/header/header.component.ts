import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private authUserService: AuthUserService,
    private authenticationService: AuthenticationService,
    private sharedShopService: SharedShopService,
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
    })
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if(result) {
          this.sharedUserService.user.next(result.result);
        }
      })
  }
  navigateToHome() {
    this.router.navigate(['/shops/all']);
    this.sharedShopService.shop.next(null);
  }
  navigateToLogin() {
    this.router.navigate([{ outlets: { modal: 'login' } }]);

  }
  navigateToSignup() {
    this.router.navigate([{ outlets: { modal: 'register' } }]);
  }
  displayPreview() {

  }
  logout() {
    this.sharedLoadingService.screenLoading.next({loading: true, label: 'Logging out...'});
    this.authenticationService.logout().then(result => {
      setTimeout(() => {
        this.sharedLoadingService.screenLoading.next({loading: false});
        this.router.navigate(['']);
        this.sharedShopService.shop.next(null);
      }, 500);
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
