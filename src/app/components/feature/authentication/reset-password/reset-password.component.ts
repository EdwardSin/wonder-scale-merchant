import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { PasswordValidator } from '@validations/user-validation/password.validator';
import { User } from '@objects/user';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UserService } from '@services/http/general/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading: WsLoading = new WsLoading;
  resetPasswordForm;
  resetSuccess: Boolean;
  user: User;
  resetToken: String;
  passwordValidator = new PasswordValidator;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private userService: UserService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.resetPasswordForm = WSFormBuilder.createResetPasswordForm();
    this.getResetPasswordUser();
  }
  getResetPasswordUser() {
    this.resetToken = this.route.snapshot.params.token;
    this.userService.resetUserFromLink(this.resetToken).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.user = result;
    })
  }
  resetPassword() {
    if (this.resetPasswordForm.status == 'VALID') {
      this.loading.start();
      this.userService.resetPassword({ email: this.user.email, password: this.resetPasswordForm.value.password, confirmPassword: this.resetPasswordForm.value.confirmPassword, resetToken: this.resetToken }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          console.log(result);
          this.resetSuccess = true;
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
  resendLink() {

  }
  get password() { return this.resetPasswordForm.get("password"); }

}
