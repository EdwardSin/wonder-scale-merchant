import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessTokenService } from '../access-token.service';
import { DateTimeHelper } from '@helpers/datetimehelper/datetime.helper';
import { AuthTrackContributorUrl } from '@enum/url.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthTrackContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getTracks() {
    return this.http.get(AuthTrackContributorUrl.getTracksUrl, this.accessTokenService.getAccessToken());
  }
  getTracksBetweenDates(fromDate, toDate, fromHour, targets) {
    let _fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), fromHour, 0, 0);
    let _toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() + 1, fromHour, 0, 0);
    _fromDate = DateTimeHelper.getDateWithCurrentTimezone(_fromDate);
    _toDate = DateTimeHelper.getDateWithCurrentTimezone(_toDate);
    return this.http.post(AuthTrackContributorUrl.getTracksBetweenDatesUrl, {fromDate: _fromDate, toDate: _toDate, targets} , this.accessTokenService.getAccessToken());
  }
  getTodayTrack(fromHour) {
    let date = new Date;
    let fromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), fromHour, 0, 0);
    let toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, fromHour, 0, 0);
    fromDate = DateTimeHelper.getDateWithCurrentTimezone(fromDate);
    toDate = DateTimeHelper.getDateWithCurrentTimezone(toDate);
    return this.http.post(AuthTrackContributorUrl.getTodayTrackUrl, {fromDate, toDate}, this.accessTokenService.getAccessToken());
  }
  addNewTrack(obj) {
    return this.http.post(AuthTrackContributorUrl.addNewTrackUrl, obj, this.accessTokenService.getAccessToken());
  }
  editTrack(obj) {
    return this.http.put(AuthTrackContributorUrl.editNewTrackUrl + '/' + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  activateTrack(obj) {
    return this.http.put(AuthTrackContributorUrl.activateTrackUrl, obj, this.accessTokenService.getAccessToken());
  }
  inactivateTrack(obj) {
    return this.http.put(AuthTrackContributorUrl.inactivateTrackUrl, obj, this.accessTokenService.getAccessToken());
  }
  removeTrack(obj) {
    return this.http.delete(AuthTrackContributorUrl.removeTrackUrl + '/' + obj._id, this.accessTokenService.getAccessToken());
  }
  getUTCTimeDifference() {
    return new Date().getTimezoneOffset() * -1 / 60;
  }
}
