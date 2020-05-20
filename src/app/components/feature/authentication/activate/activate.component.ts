import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '@services/http/general/user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { environment } from '@environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  loading: WsLoading = new WsLoading;
  resendLoading: WsLoading = new WsLoading;
  activateSuccess;
  resend;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private authUserService: AuthUserService,
    private userService: UserService,
    private sharedUserService: SharedUserService,
    private jwtHelperService: JwtHelperService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.activateSuccess = false;
    this.activateUser();
  }

  activateUser() {
    this.loading.start();

    let token = this.route.snapshot.params["token"];
    this.userService.activateAccount(token).pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.loading.stop();}))
      .subscribe(result => {
        this.activateSuccess = true;
        this.getUser();
        _.delay(() => {
          this.router.navigateByUrl(environment.RETURN_URL);
        }, 3000);
      }, (err) => {
        this.activateSuccess = false;
      })
  }

  resendLink() {
    let token = this.route.snapshot.params["token"];
    let decoded = this.jwtHelperService.decodeToken(token);
    this.resendLoading.start();
    this.userService.resendActivationEmail(decoded.email).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.resend = true;
        this.resendLoading.stop();
      }, (err) => {
        this.resend = false;
        this.resendLoading.stop();
        WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
      })
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedUserService.user.next(result.result);
      })
  }
}
