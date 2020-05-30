import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular-6-social-login';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedUserService } from '@services/shared/shared-user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public static token: string;
    public static user_id;
    //public options: Object;
    private socket;
    constructor(
        private http: HttpClient,
        private sharedUserService: SharedUserService,
        private jwtHelper: JwtHelperService,
        private authService: AuthService
    ) {
    }
    isAuthenticated(): Promise<boolean> {
        if(!AuthenticationService.token){
            return new Promise<boolean>((resolve, reject) => {
                this.http.get('/api/users/is-authenticated').subscribe(result => {
                    this.setupAuthentication(result);
                    resolve(result['loggedIn']);
                }, err => {
                    resolve(false);
                });
            });    
        }
        else{
            return new Promise<boolean>((resolve) => resolve(this.jwtHelper.decodeToken(AuthenticationService.token)));
        }
    }
    login(email: string, password: string): Observable<any> {
        let credential = { email: email, password: password };
        return this.http.post('/api/users/login', credential).pipe(
            map(result => {
                this.setupAuthentication(result);
                return result;
            })
        );
    }
    loginWithFb() {
        return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    loginWithGoogle() {
        return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
    logout(): Promise<boolean> {
        return new Promise((resolve) => {
            AuthenticationService.token = null;
            AuthenticationService.user_id = null;
            this.http.post('/api/auth-users/users/logout', {}).subscribe(result => {
                this.sharedUserService.user.next(null);
                this.sharedUserService.followItems.next([]);
                resolve(result['loggedIn']);
            })
            if (this.authService['_user']) {
                this.authService.signOut();
            }
        })
    }
    setupAuthentication(result){
        AuthenticationService.token = result['token'];
        if (AuthenticationService.token && decode(AuthenticationService.token)) {
            AuthenticationService.user_id = decode(AuthenticationService.token).user_id;
        }
    }
}
