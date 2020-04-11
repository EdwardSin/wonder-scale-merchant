import { InputValidateHelper } from '@helpers/inputvalidatehelper/inputvalidate.helper';
export class Address {
  address?: string;
  state?: string;
  city?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  errors?: { address: string, postcode: string, city: string, state: string, country: string };


  constructor() {
    this.country = '';
    this.errors = { address: '', postcode: '', city: '', state: '', country: '' };
  }
  validate() {
    let address = this.address;
    let postcode = this.postcode;
    let state = this.state;
    let city = this.city;
    let country = this.country;

    if (InputValidateHelper.isEmptyAndUndefinedAndNull(address)) {
      this.errors.address = 'Address is required!';
      return false;
    } else if (InputValidateHelper.isEmptyAndUndefinedAndNull(postcode)) {
      this.errors.postcode = 'Postcode is required!';
      return false;
    } else if (InputValidateHelper.isEmptyAndUndefinedAndNull(state)) {
      this.errors.state = 'State is required!';
      return false;
    } else if (InputValidateHelper.isEmptyAndUndefinedAndNull(city)) {
      this.errors.city = 'City is required!';
      return false;
    } else if (InputValidateHelper.isEmptyAndUndefinedAndNull(country)) {
      this.errors.country = 'Country is required!';
      return false;
    }
    return true;
  }
  getFullAddress() {
    var address = this.address ? this.address + ', ' : '';
    var postcode = this.postcode ? this.postcode + ', ' : '';
    var state = this.state ? this.state + ', ' : '';
    var city = this.city ? this.city + ', ' : '';
    var country = this.country;
    return address + postcode + city + state + country;
  }
  valueChanged() {
    this.errors = { address: '', postcode: '', city: '', state: '', country: '' };
  }
}