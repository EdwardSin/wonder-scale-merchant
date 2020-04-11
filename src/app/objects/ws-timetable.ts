import _ from "lodash";
import { Day } from '@enum/day.enum';
import { DefaultEnum } from '@enum/default.enum';
import { environment } from '@environments/environment';
import { InputValidateHelper } from '@helpers/inputvalidatehelper/inputvalidate.helper';
import { StatusHelper } from '@helpers/statushelper/status.helper';
import { OpeningInfoType } from '@wstypes/opening-info.type';
import { Shop } from '@objects/shop';
import { OpeningInfo } from './opening-info';
import { TodayOpeningInfo } from './ws-today-opening-info';

// @dynamic
export class Timetable {
  operatingHourRadio: OpeningInfoType = 'no_hour_available';
  operatingHours: Array<OpeningInfo> = [];
  errors?: { operating_hour: String };
  public static days = _.values(Day);

  constructor() {
    for (let day of Timetable.days) {
      this.operatingHours.push(new OpeningInfo(day));
    }
  }
  public static get DEFAULT_OPENING_INFO(): Array<OpeningInfo> {
    let formatted_days = this.days.map(day => new OpeningInfo(day));
    return formatted_days;
  };
  public static getTodayDateTime(shop: Shop): TodayOpeningInfo {
    let days = Timetable.days;
    let todayOpeningInfo = new TodayOpeningInfo;
    todayOpeningInfo.openingInfoType = shop.openingInfoType;
    if (shop && shop.openingInfoType === "selected_hours") {
      todayOpeningInfo.todayDate = shop.openingInfo.find(day => day.day === days[todayOpeningInfo.today]);
      todayOpeningInfo.openingInfos = shop.openingInfo;
      if (todayOpeningInfo.todayDate) {
        if (todayOpeningInfo.todayDate.selected) {
          for (let time of todayOpeningInfo.todayDate.time) {
            if (StatusHelper.isBetweenTime(new Date(), time.openingHour || time.openingHour, time.closeHour || time.closeHour)) {
              todayOpeningInfo.currentState = true;
              todayOpeningInfo.currentStatusName = 'Opening Now';
              break;
            }
          }
        } else {
          todayOpeningInfo.currentState = todayOpeningInfo.todayDate.selected;
        }
      }
    }
    return todayOpeningInfo;

    function getTypeName(type: OpeningInfoType) {
      switch (type) {
        case 'always_open':
          return 'Always Open';
        case 'selected_hours':
          return 'Close Now';
        case 'temporary_closed':
          return 'Temporary Closed';
        case 'no_hour_available':
          return 'No Hour Available';
      }
    }
  }
  selectOperatingHour(i) {
    this.operatingHours[i].selected = !this.operatingHours[i].selected;
    if (this.operatingHours[i].selected) {
      this.operatingHours[i].time[0].openingHour = DefaultEnum.OPENING_HOUR;
      this.operatingHours[i].time[0].closeHour = DefaultEnum.CLOSE_HOUR;
    } else {
      this.operatingHours[i].time = [
        {
          openingHour: environment.DEFAULT_STRING,
          closeHour: environment.DEFAULT_STRING
        }
      ];
    }
  }
  addHour(i) {
    if (this.operatingHours[i].time.length < 4) {
      this.operatingHours[i].time.push({
        openingHour: DefaultEnum.OPENING_HOUR,
        closeHour: DefaultEnum.CLOSE_HOUR
      });
    }
  }
  deleteHour(i, j) {
    if (this.operatingHours && this.operatingHours[i] && this.operatingHours[i] && this.operatingHours[i].time) {
      this.operatingHours[i].time.splice(j, 1);
    }
  }
  validate() {
    if (this.operatingHourRadio === 'selected_hours') {
      return InputValidateHelper.validateAndCorrectSelectedHours(this.operatingHours);
    }
    else {
      this.operatingHours = [];
    }
    return true;
  }
}
