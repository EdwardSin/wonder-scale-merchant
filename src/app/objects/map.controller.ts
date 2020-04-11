import _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { MapcontrollerHelper } from '@helpers/mapcontrollerhelper/mapcontroller.helper';
import { MapHelper } from '@helpers/maphelper/map.helper';
import { WsGpsService } from '@services/general/ws-gps.service';
import { Address } from '@objects/address';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';

export class MapCircle {
    lat?: number = 0;
    lng?: number = 0;
    length?: number = 40000000;
    radius?: number;
}
// @dynamic
export class MapController {
    mapLat: number;
    mapLng: number;
    markerLat?: number;
    markerLng?: number;
    suggestions?: Array<any>;
    displaySuggestions?: Array<any>;
    displayed?: boolean;
    mapCircle?: MapCircle;
    hovered?: number;
    zoom?: number;
    address?: Address;
    loading?: WsLoading = new WsLoading;
    locationLoading?: WsLoading = new WsLoading;
    static currentLat: number;
    static currentLng: number;

    valueChanged = _.debounce((value) => this.getSuggestions(value), 300);


    private ngUnsubscribe: Subject<any> = new Subject();


    constructor(private gpsService: WsGpsService, address?: Address) {
        this.mapCircle = new MapCircle();
        this.address = address || new Address();
    }
    getSuggestions(address) {
        let query = address;
        this.loading.start();
        if (query !== '') {
            this.gpsService.getSuggestions(query)
                .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
                .subscribe(result => {
                    if (result && result['suggestions']) {
                        this.suggestions = result['suggestions'];
                        this.displaySuggestions = this.suggestions.map(x => MapHelper.getFormattedAddress(x));
                        this.displayed = true;
                    }
                });
        }
        else {
            this.suggestions = [];
            this.displaySuggestions = [];
            this.loading.stop();
        }
    }
    mapClick(event) {
        this.markerLat = event.coords.lat;
        this.markerLng = event.coords.lng;
    }
    selectAddress(event) {
        this.hovered = MapcontrollerHelper.selectAddress(event, this.hovered, this);
    }
    async onAddressChanged() {
        var address = this.suggestions[this.hovered];
        if (this.suggestions.length > 0 && address) {
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
            this.mapLat = coords['lat'];
            this.mapLng = coords['lng'];
            this.markerLat = coords['lat'];
            this.markerLng = coords['lng'];
            this.locationLoading.stop();
            this.suggestions = [];
            this.displaySuggestions = [];
        }
    }
    async setMapToCurrentPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            MapHelper.getCurrentPosition().then(coords => {
                this.markerLat = coords.latitude;
                this.markerLng = coords.longitude;
                this.mapLat = coords.latitude;
                this.mapLng = coords.longitude;
                MapController.currentLat = coords.latitude;
                MapController.currentLng = coords.longitude;
                resolve(coords);
            })
        });
    }
}