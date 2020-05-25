import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@objects/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USER_URL = '/api/users';
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getUserByUserId(userId): Observable<User> {
    return this.http.get<User>(this.USER_URL + '/profile/' + userId);
  }
  addUser(user) {
    let headers = new HttpHeaders();
    let source = environment.SOURCE || 'website';
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.USER_URL + '/register', {...user, source}, { headers: headers });
  }
  addUserByFb(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.USER_URL + '/register-by-fb', user, { headers: headers });
  }
  addUserByGoogle(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.USER_URL + '/register-by-google', user, { headers: headers });
  }
  activateAccount = function (token) {
    return this.http.put(this.USER_URL + '/activate/' + token);
  };
  savePassword = function (regData) {
    return this.http.put(this.USER_URL + '/save/password', regData);
  };
  checkEmail = function (email) {
    return this.http.get(this.USER_URL + '/checkemail/' + email);
  };
  sendUsernameToEmail = function (resetData) {
    return this.http.get(this.USER_URL + '/reset/username/' + resetData);
  };
  resendActivationEmailConfirmation = function (resetData) {
    let source = environment.SOURCE || 'website';
    return this.http.post(this.USER_URL + '/resend/activation-email', {...resetData, source});
  };
  resendActivationEmail = function (email) {
    let source = environment.SOURCE || 'website';
    return this.http.put(this.USER_URL + '/resend/activation-email', { email, source });
  };
  sendPasswordLinkToEmail(resetData) {
    let source = environment.SOURCE || 'website';
    return this.http.post(this.USER_URL + '/reset/password', {...resetData, source});
  };
  resetPassword(obj: { email: string, password: string, confirmPassword: string, resetToken: string }) {
    let source = environment.SOURCE || 'website';
    return this.http.patch(this.USER_URL + '/reset/password/' + obj.resetToken, {...obj, source});
  }
  // Grab user's information from e-mail reset link
  resetUserFromLink(token): Observable<User> {
    return this.http.get<User>(this.USER_URL + '/reset/password/' + token);
  };
}
