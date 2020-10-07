import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureUrl } from '@enum/url.enum';

@Injectable({ providedIn: 'root' })
export class SendemailService {
  constructor(private http: HttpClient) { }

  sendEmail(content) {
    return this.http.post(FeatureUrl.sendEmailUrl, content);
  }
  sendReportReview(content) {
    return this.http.post(FeatureUrl.sendReportReviewUrl, content);
  }
  sendStoreInvitationEmail(obj) {
    return this.http.post(FeatureUrl.sendStoreInvitationEmailUrl, obj);
  }
  sendInformation(obj) {
    return this.http.post(FeatureUrl.sendInformationUrl, obj);
  }
}
