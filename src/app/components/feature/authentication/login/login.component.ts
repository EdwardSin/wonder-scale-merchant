import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { Title } from '@constants/title';
import { AuthUserService } from '@services/http/general/auth-user.service';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { UserService } from '@services/http/general/user.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import decode from 'jwt-decode';
import { ScreenService } from '@services/general/screen.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  isMobileSize: boolean;
  resend: boolean;
  loading: WsLoading = new WsLoading;
  resendLoading: WsLoading = new WsLoading;
  forgotPasswordForm: FormGroup;
  loginForm: FormGroup;
  storeEmail: string;
  storePassword: string;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private authUserService: AuthUserService,
    private screenService: ScreenService,
    private sharedUserService: SharedUserService) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale(Title.HOME);
    this.createLoginForm();
    this.createPasswordForm();
    this.screenService.isMobileSize.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.isMobileSize = result;
    })
  }
  ngAfterViewInit() {
  }
  login() {
    this.loading.start();
    this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
      .subscribe(result => {
        this.getUser();
        this.navigateToReturnUrl();
      }, err => {
        if (err.error.message == 'Please activate your account!') {
          this.resend = true;
          this.storeEmail = this.loginForm.value.email;
          this.storePassword = this.loginForm.value.password;
        }
        this.loginForm.controls['password'].setValue('');
        WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
      })
  }
  loginWithFb() {
    this.authenticationService.loginWithFb()
      .then(user => {
        if (user) {
          let firstName = "";
          let lastName = "";
          if (user.name) {
            let name = user.name.trim();
            firstName = user.name.substring(0, user.name.lastIndexOf(" ")).trim();
            lastName = user.name.substring(user.name.lastIndexOf(" ")).trim();
          }
          let userObj = {
            firstName: firstName,
            lastName: lastName,
            email: user.email,
            profileImage: user.photoUrl
          };
          this.userService.addUserByFb(userObj).subscribe(result => {
            AuthenticationService.token = result['token'];
            if (AuthenticationService.token && decode(AuthenticationService.token)) {
              AuthenticationService.user_id = decode(AuthenticationService.token).user_id;
            }
            this.getUser();
            this.navigateToReturnUrl();
          }, (err) => {
            WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
          });
        }
      });
  }
  loginWithGoogle() {
    this.authenticationService.loginWithGoogle()
      .then(user => {
        if (user) {
          let decodedUser = this.jwtHelper.decodeToken(user['idToken']);
          let userObj = {
            firstName: decodedUser.given_name,
            lastName: decodedUser.family_name,
            email: decodedUser.email,
            profileImage: decodedUser.picture,
            receiveInfo: true
          };
          this.userService.addUserByGoogle(userObj).subscribe(result => {
            AuthenticationService.token = result['token'];
            if (AuthenticationService.token && decode(AuthenticationService.token)) {
              AuthenticationService.user_id = decode(AuthenticationService.token).user_id;
            }
            this.getUser();
            this.navigateToReturnUrl();
          }, (err) => {
            WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
          });
        }
      });
  }
  resendActiveLink() {
    this.resendLoading.start();
    this.userService.resendActivationEmailConfirmation({ email: this.storeEmail, password: this.storePassword }).subscribe(result => {
      this.userService.resendActivationEmail(this.storeEmail).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        WsToastService.toastSubject.next({ content: "Activation Email is sent!", type: 'success' });
        this.resend = false;
        this.resendLoading.stop();
      });
    });
  }

  createPasswordForm() {
    this.forgotPasswordForm = WSFormBuilder.createForgetPasswordForm();
  }
  createLoginForm() {
    this.loginForm = WSFormBuilder.createLoginForm();
  }
  getUser() {
    this.authUserService.getUser().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedUserService.user.next(result.result);
      })
  }
  getReturnUrl() {
    let returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl !== undefined) {
      return returnUrl;
    }
    return environment.RETURN_URL;
  }
  navigateToReturnUrl() {
    let returnUrl = this.getReturnUrl();
    let preview = this.route.snapshot.queryParams['preview'];
    let id = this.route.snapshot.queryParams['id'];
    if (returnUrl)  {
      this.router.navigateByUrl(returnUrl);
    } else if (preview == 'true' && id) {
      this.router.navigate([], { queryParams: {modal: null}, queryParamsHandling: 'merge'});
      return;
    } else {
      this.router.navigate([], { queryParams: {modal: null}, queryParamsHandling: 'merge'});
    }
  }
}
