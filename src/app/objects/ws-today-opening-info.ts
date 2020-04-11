import _ from "lodash";
import { Day } from './../enum/day.enum';
import { OpeningInfoType } from './../types/opening-info.type';
import { OpeningInfo } from "./opening-info";

export class TodayOpeningInfo {
    todayDate: OpeningInfo;
    openingInfos: Array<OpeningInfo>;
    today: number = new Date().getDay();
    openingInfoType: OpeningInfoType;
    currentStatusName: CurrentStatusName;
    currentState: boolean;
    days: Array<Day> = _.values(Day)
}

type CurrentStatusName = "Opening Now" | "Close Now";