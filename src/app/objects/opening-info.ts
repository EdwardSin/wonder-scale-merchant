import { DayType } from '../types/day.types';
import { Constants } from './../constants/constants';

export class OpeningInfo {
    day: DayType;
    time: Array<OpeningTime>;
    selected: boolean

    constructor(day: DayType) {
        this.day = day;
        this.time = new Array<OpeningTime>({
            openingHour: Constants.businessHour.openingHour,
            closeHour: Constants.businessHour.closeHour
        });
    }
}

class OpeningTime {
    openingHour?: string = "";
    closeHour?: string = "";
}