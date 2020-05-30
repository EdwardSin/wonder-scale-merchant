import { DefaultEnum } from '@enum/default.enum';

export class InputHelper {

  constructor() { }

  public static focus(el) {
    let value = el.target.value;
    if (value == "") {
      el.target.value = DefaultEnum.URL;
    }
  }
  public static blur(el) {
    if (el.target.value == DefaultEnum.URL) {
      el.target.value = "";
    }
  }

  public static nextField(el) {
    var nextIndex = el["srcElement"].tabIndex + 1;
    $("[tabIndex='" + nextIndex + "']").focus();
  }

  public static decimalTo(event, digit: number = 2): string {
    let value = event["target"]["value"];
    return +value ? string(+(value).toLocaleString("en-US", { minimumFractionDigits: digit, maximumFractionDigits: digit })) : string(0.00);
  }

  //Tested
  public static getValidPrice(event): string {
    var MAX_VALUE = 10000000;
    var MIN_VALUE = 0;
    var valueAsString = InputHelper.decimalTo(event);
    var valueAsFloat = this.getFloat(valueAsString);
    var result = "0.00";
    if (valueAsFloat > MAX_VALUE) {
      result = MAX_VALUE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    else if (valueAsFloat <= 0) {
      result = MIN_VALUE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    else {
      result = valueAsString.toString();
    }
    return result;
  }

  //Tested
  public static getValidDiscount(event) {
    var MAX_VALUE = 100;
    var MIN_VALUE = 0;
    var valueAsString = InputHelper.decimalTo(event, 2);
    var valueAsFloat = this.getFloat(valueAsString);
    var result = "0.00";
    if (valueAsFloat > MAX_VALUE) {
      result = MAX_VALUE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    else if (valueAsFloat <= 0) {
      result = MIN_VALUE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    else {
      result = valueAsString.toString();
    }
    return result;
  }

  public static getFloat(valueAsString) {
    return valueAsString ? parseFloat(valueAsString.replace(/,/g, '')) : 0;
  }
}
