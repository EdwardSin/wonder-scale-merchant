import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUserUrl } from '@enum/url.enum';
import { User } from '@objects/user';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthUserService {


  constructor(private http: HttpClient) { }

  getUser(): Observable<Result<User>> {
    return this.http.get<Result<User>>(AuthUserUrl.getUserUrl);
  }
  editProfile(obj): Observable<Result<User>> {
    return this.http.put<Result<User>>(AuthUserUrl.editProfileUrl, obj);
  }
  editGeneral(obj) {
    return this.http.put(AuthUserUrl.editGeneralUrl, obj);
  }
  changePassword = function (obj) {
    return this.http.put(AuthUserUrl.changePasswordUrl, obj);
  };
}
