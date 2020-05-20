import { takeUntil, finalize, debounceTime } from 'rxjs/operators';
import { MapHelper } from '@helpers/maphelper/map.helper';
import { Address } from './address';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { WsGpsService } from '@services/general/ws-gps.service';
import { MapcontrollerHelper } from '@helpers/mapcontrollerhelper/mapcontroller.helper';
import { WsLoading } from '@elements/ws-loading/ws-loading';

export class MapController{
    _zoom: number = 14;
    currentPoint: Point = {latitude: 0, longitude: 0};
    mapPoint: Point = {latitude: 0, longitude: 0};
    mapCircle: MapCircle;
    address?: Address;
    hovered?: number;
    suggestions?: Array<any>;
    loading?: WsLoading = new WsLoading;
    displayed: boolean;
    locationLoading: WsLoading = new WsLoading;
    markerPoint: Point = {latitude: 0, longitude: 0};
    valueChanged = _.debounce((value) => this.getSuggestions(value), 300);
    private suggestionsObj?: Array<any>;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(private gpsService: WsGpsService, address?: Address) {
        this.mapCircle = new MapCircle();
        this.address = address || new Address();
        this.mapCircle.radius = this.mapCircle.length / Math.pow(2, this.zoom);
    }
    get zoom(){
        return this._zoom;
    }
    set zoom(value) {
        this._zoom = value;
        this.mapCircle.radius = this.mapCircle.length / Math.pow(2, this.zoom);
    }
    getSuggestions(address) {
        let query = address;
        this.loading.start();
        if (query !== '') {
            this.suggestions = [];
            this.gpsService.getSuggestions(query)
                .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
                .subscribe(result => {
                    if (result && result['suggestions']) {
                        this.suggestionsObj = result['suggestions'];
                        this.suggestions = this.suggestionsObj.map(x => MapHelper.getFormattedAddress(x));
                        this.displayed = true;
                    }
                });
        }
        else {
            this.suggestions = [];
            this.loading.stop();
        }
    }
    mapClick(event) {
        this.markerPoint = {
            latitude: event.coords.lat,
            longitude: event.coords.lng
        };
    }
    selectAddress(event) {
        this.hovered = MapcontrollerHelper.selectAddress(event, this.hovered, this);
    }
    async onAddressSelected() {
        var address = this.suggestionsObj[this.hovered];
        if (this.suggestionsObj.length > 0 && address) {
            this.address.postcode = address.address.postalCode;
            this.address.state = address.address.state;
            this.address.city = address.address.city;
            this.address.country = address.address.country;
            this.address.address = MapHelper.getSelectedFormattedAddress(address);
            this.locationLoading.start();
            let coords = await new Promise((resolve, reject) => {
                this.gpsService.geocode({ address: this.address.address }, (coords) => {
                    resolve(coords);
                })
            });
            this.mapPoint = {latitude: coords['lat'], longitude: coords['lng']};
            this.mapCircle.latitude = coords['lat'];
            this.mapCircle.longitude = coords['lng'];
            this.markerPoint = { latitude: coords['lat'], longitude: coords['lng']};
            
            this.locationLoading.stop();
        }
    }
    async setMapToCurrentPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            MapHelper.getCurrentPosition().then(coords => {
                this.markerPoint = { latitude: coords.latitude, longitude: coords.latitude};
                this.currentPoint = { latitude: coords.longitude, longitude: coords}
                this.mapCircle.latitude = coords.latitude;
                this.mapCircle.longitude = coords.longitude;
                resolve(coords);
            })
        });
    }
  }
export class Point {
    latitude: number = 0;
    longitude: number = 0;
  }

export class MapCircle {
    latitude: number = 0;
    longitude: number = 0;
    length: number = 40000000;
    radius: number;
}