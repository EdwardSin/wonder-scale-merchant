import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUserUrl } from '@enum/url.enum';
import { User } from '@objects/user';
import { Result } from '@objects/result';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthUserService {


  constructor(private http: HttpClient) { }

  getUser(): Observable<Result<User>> {
    return this.http.get<Result<User>>(AuthUserUrl.getUserUrl);
  }
  getProfile(): Observable<Result<User>> {
    return this.http.get<Result<User>>(AuthUserUrl.getProfileUrl);
  }
  removeProfileImage() {
    return this.http.put(AuthUserUrl.removeProfileImageUrl, {});
  }
  editProfile(obj): Observable<Result<User>> {
    return this.http.put<Result<User>>(AuthUserUrl.editProfileUrl, obj);
  }
  editGeneral(obj) {
    return this.http.put(AuthUserUrl.editGeneralUrl, obj);
  }
  changePassword(obj) {
    let source = environment.SOURCE || 'website';
    return this.http.put(AuthUserUrl.changePasswordUrl, {...obj, source});
  };
}
