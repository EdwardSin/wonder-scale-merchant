import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthReviewContributorUrl } from '@enum/url.enum';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthReviewContributorService {

  constructor(private http: HttpClient,
    private accessTokenService: AccessTokenService) { }

  getReviews(obj?) {
    return this.http.get(AuthReviewContributorUrl.getReviewsUrl, {
      ...this.accessTokenService.getAccessToken(),
      params: {
        ...obj
      }
    });
  }
}
