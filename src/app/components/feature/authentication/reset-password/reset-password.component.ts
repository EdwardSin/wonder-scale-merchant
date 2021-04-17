import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WsFormBuilder } from '@builders/wsformbuilder';
import { PasswordValidator } from '@validations/user-validation/password.validator';
import { User } from '@objects/user';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UserService } from '@services/http/general/user.service';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { SharedUserService } from '@services/shared/shared-user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  userLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  resetPasswordForm;
  resetSuccess: Boolean;
  user: User;
  resetToken: string;
  passwordValidator = new PasswordValidator;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private router: Router,
    private userService: UserService,
    private authUserService: AuthUserService,
    private sharedUserService: SharedUserService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.resetPasswordForm = WsFormBuilder.createResetPasswordForm();
    this.getResetPasswordUser();
  }
  getResetPasswordUser() {
    this.resetToken = this.route.snapshot.queryParams.token;
    this.userLoading.start();
    this.userService.resetUserFromLink(this.resetToken).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.user = result;
      _.delay(() => {
        this.userLoading.stop();
      },2000);
    }, err => {
      this.userLoading.stop();
    })
  }
  resetPassword() {
    if (this.resetPasswordForm.status == 'VALID') {
      this.loading.start();
      this.userService.resetPassword({ email: this.user.email, password: this.resetPasswordForm.value.password, confirmPassword: this.resetPasswordForm.value.confirmPassword, resetToken: this.resetToken }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.resetSuccess = true;
          this.getUser(() => {
            _.delay(() => {
              this.router.navigateByUrl(environment.RETURN_URL);
            }, 2000);
          });
        }, err => {
          console.log(err);
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
        })
    }
    else {
      let passwordController = this.resetPasswordForm.get('password');
      let confirmPasswordController = this.resetPasswordForm.get('confirmPassword');
      if (!this.passwordValidator.validate(passwordController, confirmPasswordController)) {
        if (this.passwordValidator.errors.password) {
          WsToastService.toastSubject.next({ content: this.passwordValidator.errors.password, type: 'danger' });
        }
        else {
          WsToastService.toastSubject.next({ content: this.passwordValidator.errors.confirmPassword, type: 'danger' });
        }
      }
    }
  }
  close() {
    this.router.navigate([], {queryParams: {modal: 'null'}});
  }
  get password() { return this.resetPasswordForm.get("password"); }
  getUser(callback) {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedUserService.user.next(result.result);
        if(callback) {
          callback();
        }
      })
  }
}
