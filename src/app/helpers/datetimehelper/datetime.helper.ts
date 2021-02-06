import * as moment from 'moment';
export class DateTimeHelper {
    static getTodayWithCurrentTimezone () {
        let date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return moment(startDate).add(-date.getTimezoneOffset(), 'minutes').toDate();
    }
    static getDateWithCurrentTimezone (_date) {
        let startDate = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate());
        return moment(startDate).add(-_date.getTimezoneOffset(), 'minutes').toDate();
    }
}