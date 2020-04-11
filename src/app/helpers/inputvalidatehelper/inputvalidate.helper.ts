import { TimePeriod } from '@enum/time-period.enum';

const DEFAULT_OPENING_HOUR = "09:00 am";
const DEFAULT_CLOSE_HOUR = "05:00 pm";

// @dynamic
export class InputValidateHelper {
  constructor() {
  }
  // No Test
  public static validateStartBusiness(shop){
    return !this.isEmptyAndUndefinedAndNull(shop) &&
      !this.isEmptyAndUndefinedAndNull(shop.phone) &&
      !this.isEmptyAndUndefinedAndNull(shop.fullAddress) &&
      !this.isEmptyAndUndefinedAndNull(shop.fullAddress.address) &&
      !this.isEmptyAndUndefinedAndNull(shop.fullAddress.postcode) &&
      !this.isEmptyAndUndefinedAndNull(shop.fullAddress.state) &&
      !this.isEmptyAndUndefinedAndNull(shop.fullAddress.country) &&
      (!this.isEmptyAndUndefinedAndNull(shop.openingHour) ||
        !this.isEmptyAndUndefinedAndNull(shop.openingInfoType))
  }
  

  // Loop
  // If valid return true,
  // if false continue to check others and set false to value;
  // set default value if validate is false;
  // 2 operations
  // Tested
  public static validateAndCorrectSelectedHours(operating_hours) {
    var validatedOpenTime = true;
    var validatedCloseTime = true;
    for (let i = 0; i < operating_hours.length; i++) {
      for (let j = 0; j < operating_hours[i].time.length; j++) {
        var time = operating_hours[i].time[j];
        if (operating_hours[i].selected) {
          var isValidOpeningHour = this.validatedHour(time.openingHour);
          var isValidCloseHour = this.validatedHour(time.closeHour);
          validatedOpenTime = isValidOpeningHour && validatedOpenTime;
          validatedCloseTime = isValidCloseHour && validatedCloseTime;
          time.openingHour = isValidOpeningHour ? this.getFormattedHour(time.openingHour) : DEFAULT_OPENING_HOUR;
          time.closeHour = isValidCloseHour ? this.getFormattedHour(time.closeHour) : DEFAULT_CLOSE_HOUR;
        }
      }
    }
    return validatedOpenTime && validatedCloseTime;
  }

  // Tested
  public static isEmptyAndUndefinedAndNull(value) {
    return value == "" || value == null || value == undefined || (typeof value == "string" && value.trim() == '');
  }
  // Tested
  public static setDefaultDateIfInvalid(hour, defaultHour){
    return this.validatedHour(hour) ? this.getFormattedHour(hour) : defaultHour;
  }

  // Tested
  public static getFormattedHour(hour){
    return hour.slice(0,6) + hour.slice(6, 8).toLowerCase();
  }

  // Tested
  public static validatedHour(hour) {
    var HH = Number(hour.slice(0, 2));
    var symbol = hour.slice(2, 3);
    var MM = Number(hour.slice(3, 6));
    var AMPM = hour.slice(6, 8) || "";

    return (hour.length == 8 && HH > 0 && HH < 13 &&
      symbol == ":" && MM > -1 && MM < 60 &&
      (AMPM.toLowerCase() == TimePeriod.AM || AMPM.toLowerCase() == TimePeriod.PM));
  }

  public static getValueOrEmpty(obj, value, default_value = "") {
    return obj != "" && obj != undefined && value != "" && value != undefined ? obj[value] : default_value;
  }
}
