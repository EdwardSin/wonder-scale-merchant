import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '@services/http/general/user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';

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
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private userService: UserService,
    private jwtHelperService: JwtHelperService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.activateSuccess = false;
    this.activateUser();
  }

  activateUser() {
    this.loading.start();

    let token = this.route.snapshot.params["token"];
    this.userService.activateAccount(token).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.activateSuccess = true;
        this.loading.stop();
      }, (err) => {
        this.activateSuccess = false;
        this.loading.stop();
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

}
