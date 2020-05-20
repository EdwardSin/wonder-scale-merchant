import { Component, OnInit } from '@angular/core';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { UserService } from '@services/http/general/user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loading: WsLoading = new WsLoading;
  forgotPasswordForm;
  sendSuccess: Boolean;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.forgotPasswordForm = WSFormBuilder.createForgetPasswordForm();
  }
  forgotPassword() {
    if (this.forgotPasswordForm.status == 'VALID') {
      this.loading.start();
      this.userService.sendPasswordLinkToEmail({ email: this.forgotPasswordForm.value.email }).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.sendSuccess = true;
        }, err => {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
        })
    }
    else {
      WsToastService.toastSubject.next({ content: "Please enter a valid email!", type: 'danger' });
    }
  }


}
