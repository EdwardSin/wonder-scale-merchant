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

    let headers = new HttpHeaders();
    //headers.append('Content-Type', 'application/json');
    //headers.append('withCredentials', 'true');
    //headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get(
      `https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?app_id=${environment.HERE_APP_API}&app_code=${environment.HERE_APP_CODE}&query=${query}&pretty`, { headers: headers });
  }
  geocode(address, callback) {
    let platform = new H.service.Platform({
      app_id: environment.HERE_APP_API,
      app_code: environment.HERE_APP_CODE,
      useCIT: true,
      useHTTPS: true
    });
    let geocoder = platform.getGeocodingService();
    let geocodingParameters = {

      searchText: address.address,
      country: address.country,
      jsonattributes: 1
    };

    geocoder.geocode(geocodingParameters, onSuccess, onError);
    function onSuccess(result) {
      if (result.response && result.response.view) {
        let locations = result.response.view[0].result;
        let coords = {
          lat: locations[0].location.displayPosition.latitude,
          lng: locations[0].location.displayPosition.longitude
        };
        callback(coords);
      } else {
        console.log('location is not found!');
      }
    }
    function onError(error) {
      alert('Ooops!');
    }
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
