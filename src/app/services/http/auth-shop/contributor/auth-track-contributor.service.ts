import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTrackContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getTracks() {
    return this.http.get('/api/auth-shops/track-contributors/', this.accessTokenService.getAccessToken());
  }
  getTracksBetweenDates(fromDate, toDate, fromHour, targets) {
    let date = new Date;
    let _fromDate = new Date(date.getFullYear(), date.getMonth(), fromDate.getDate(), fromHour, 0, 0);
    let _toDate = new Date(date.getFullYear(), date.getMonth(), toDate.getDate() + 1, fromHour, 0, 0);
    // if (fromHour <= this.getUTCTimeDifference()) {
    //   _fromDate = new Date(date.getFullYear(), date.getMonth(), fromDate.getDate(), fromHour, 0, 0);
    //   _toDate = new Date(date.getFullYear(), date.getMonth(), toDate.getDate() + 1, fromHour, 0, 0);
    // }
    return this.http.post('/api/auth-shops/track-contributors/tracks-between-dates', {fromDate: _fromDate, toDate: _toDate, targets} , this.accessTokenService.getAccessToken());
  }
  getTodayTrack(fromHour) {
    let date = new Date;
    let fromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), fromHour, 0, 0);
    let toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, fromHour, 0, 0);
    // if (fromHour <= this.getUTCTimeDifference()) {
    //   fromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), fromHour, 0, 0);
    //   toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, fromHour, 0, 0);
    // }
    return this.http.post('/api/auth-shops/track-contributors/today-track', {fromDate, toDate}, this.accessTokenService.getAccessToken());
  }
  addNewTrack(obj) {
    return this.http.post('/api/auth-shops/track-contributors', obj, this.accessTokenService.getAccessToken());
  }
  editTrack(obj) {
    return this.http.put('/api/auth-shops/track-contributors/' + obj._id, obj, this.accessTokenService.getAccessToken());
  }
  activateTrack(obj) {
    return this.http.put('/api/auth-shops/track-contributors/activate', obj, this.accessTokenService.getAccessToken());
  }
  inactivateTrack(obj) {
    return this.http.put('/api/auth-shops/track-contributors/inactivate', obj, this.accessTokenService.getAccessToken());
  }
  removeTrack(obj) {
    return this.http.delete('/api/auth-shops/track-contributors/' + obj._id, this.accessTokenService.getAccessToken());
  }
  getUTCTimeDifference() {
    return new Date().getTimezoneOffset() * -1 / 60;
  }
}
