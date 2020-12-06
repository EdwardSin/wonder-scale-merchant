import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
declare let H: any;

@Injectable({
  providedIn: 'root'
})
export class WsGpsService {
  constructor(private http: HttpClient) { }
  getSuggestions(query) {
    return this.http.get(`https://photon.komoot.io/api/?q=${query}&limit=5`);
  }

  // getCurrentLocation(callback, previousLocation?){

  //   if (navigator && navigator.geolocation) {
  //     getPosition.bind(this)();
  //   } else {
  //     ipLookUp();
  //     alert('Geolocation is not supported by this browser');
  //   }

  //   function getPosition() {
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         success.bind(this)(position);
  //       },
  //       err => {
  //         ipLookUp();
  //       },
  //       { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
  //     );
  //   }

  //   function success(position) {
  //     this.currentCoords.next({lat: position.coords['latitude'], lng: position.coords['longitude']});
  //     if(previousLocation){
  //       callback({lat: previousLocation.lat, lng:previousLocation.lng})
  //     }
  //     else{
  //       callback({
  //         lat: position.coords['latitude'],
  //         lng: position.coords['longitude']
  //       });
  //     }
  //   }
  //   function ipLookUp() {
  //     $.ajax('//ip-api.com/json').then(
  //       (res) => {
  //         //console.log("User's Location Data is ", res);
  //         let position = {
  //           coords: {
  //             latitude: res.lat,
  //             longitude: res.lon
  //           }
  //         };
  //         success.bind(this)(position);
  //       },
  //       (data, status) => {
  //         console.log('Request failed.  Returned status of', status);
  //       }
  //     );
  //   }
  // }
}
