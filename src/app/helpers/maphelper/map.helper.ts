declare var $: any;
export class MapHelper {
    
    public static getCurrentPosition(callback?, previousLocation?): Promise<any> {
        if (navigator && navigator.geolocation) {
            return new Promise(resolve => resolve(getPosition()));
        } else {
            alert('Geolocation is not supported by this browser');
            return new Promise(resolve => resolve(ipLookUp()));
        }

        function getPosition(): Promise<any> {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(position => {
                    resolve(position.coords);
                }, err => {
                    ipLookUp();
                }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
            });
        }

        function success(position) {
            if (callback) callback({ lat: this.initlat, lng: this.initlng });
        }
        function ipLookUp() {
            return $.ajax('//ip-api.com/json');
        }

    }

    public static getFormattedAddress(x) {
        const houseNumber = x.address.houseNumber ? x.address.houseNumber + ', ' : '';
        const street = x.address.street ? x.address.street + ', ' : '';
        const district = x.address.district ? x.address.district + ', ' : '';
        const city = x.address.city ? x.address.city + ', ' : '';
        const state = x.address.state ? x.address.state + ', ' : '';
        const country = x.address.country ? x.address.country : '';
        const address = houseNumber + street + district + city + state + country;
        return address;
    }

    public static getSelectedFormattedAddress(address, type = 'full') {
        const houseNumber = this.getTextWithSpaceOrEmpty(address.address.houseNumber);
        const street = this.getTextWithSpaceOrEmpty(address.address.street);
        const district = this.getTextWithSpaceOrEmpty(address.address.district);
        const county = this.getTextWithSpaceOrEmpty(address.address.county);
        const city = this.getTextWithSpaceOrEmpty(address.address.city);
        const state = this.getTextWithSpaceOrEmpty(address.address.state);
        const postalCode = this.getTextWithSpaceOrEmpty(address.address.postalCode);
        const country = address.address.country ? address.address.country : '';
        if (type === 'full')
            return houseNumber + street + district + city + state + country;
        else return houseNumber + street + district + county + city;
    }

    private static getTextWithSpaceOrEmpty(text) {
        return text ? text + ', ' : '';
    }
}