import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@objects/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from '@environments/environment';
import { UserUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  // getUserByUserId(userId): Observable<User> {
  //   return this.http.get<User>(UserUrl. '/profile/' + userId);
  // }
  addUser(user) {
    let headers = new HttpHeaders();
    let source = environment.SOURCE || 'website';
    headers.append('Content-Type', 'application/json');
    return this.http.post(UserUrl.registerUrl, {...user, source}, { headers: headers });
  }
  addUserByFb(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(UserUrl.registerByFbUrl, user, { headers: headers });
  }
  addUserByGoogle(user) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(UserUrl.registerByGoogleUrl, user, { headers: headers });
  }
  activateAccount = function (token) {
    return this.http.put(UserUrl.activateUrl + '/' + token);
  };
  savePassword = function (regData) {
    return this.http.put(UserUrl.savePasswordUrl, regData);
  };
  checkEmail = function (email) {
    return this.http.get(UserUrl.checkEmailUrl + '/' + email);
  };
  sendUsernameToEmail = function (resetData) {
    return this.http.get(UserUrl.resetUsernameUrl + '/' + resetData);
  };
  resendActivationEmailConfirmation = function (resetData) {
    let source = environment.SOURCE || 'website';
    return this.http.post(UserUrl.resendActivationEmailConfirmationUrl, {...resetData, source});
  };
  resendActivationEmail = function (email) {
    let source = environment.SOURCE || 'website';
    return this.http.put(UserUrl.resendActivationEmailUrl, { email, source });
  };
  sendPasswordLinkToEmail(resetData) {
    let source = environment.SOURCE || 'website';
    return this.http.post(UserUrl.resetPasswordUrl, {...resetData, source});
  };
  resetPassword(obj: { email: string, password: string, confirmPassword: string, resetToken: string }) {
    let source = environment.SOURCE || 'website';
    return this.http.patch(UserUrl.resetPasswordUrl + obj.resetToken, {...obj, source});
  }
  // Grab user's information from e-mail reset link
  resetUserFromLink(token): Observable<User> {
    return this.http.get<User>(UserUrl.resetPasswordUrl + '/' + token);
  };
}
