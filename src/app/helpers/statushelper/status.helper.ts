import { Day } from "../../enum/day.enum";

export class StatusHelper {

    public static weekday = [
        Day.Sunday,
        Day.Monday,
        Day.Tuesday,
        Day.Wednesday,
        Day.Thursday,
        Day.Friday,
        Day.Saturday
    ];

    public static isBetweenTime(currentDateTime, opening, close) {
        let openingTime = this.getOpeningTime(opening);
        let closeTime = this.getCloseTime(close, opening);
        return openingTime <= currentDateTime && currentDateTime < closeTime;
    }

    public static isCurrentOpen(openingInfoType, openingInfo, today) {
        let currentState = false;
        if (openingInfoType === "selected_hours") {
            let todayDate = openingInfo.find(day => day.day === this.weekday[today]);
            if (todayDate) {
                if (todayDate['selected']) {
                    for (let time of todayDate['time']) {
                        //openingHour & closeHour is old data
                        if (StatusHelper.isBetweenTime(new Date(), time.openingHour || time.openingHour, time.closeHour || time.closeHour)) {
                            currentState = true;
                            break;
                        }
                    }
                } else {
                    currentState = todayDate['selected'];
                }
            }
        }
        else if (openingInfoType === 'always_open') {
            currentState = true;
        }
        return currentState;
    }

    private static getCloseTime(close, opening) {
        close = this.convertTime12to24(close).split(':');
        let closeHour = close[0];
        let closeMin = close[1];
        opening = this.convertTime12to24(opening).split(':');
        let openingHour = opening[0];
        let openingMin = opening[1];
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let date = new Date().getDate();

        if (closeHour < openingHour || (closeHour == openingHour && closeMin < openingMin)) {
            return new Date(year, month, date + 1, closeHour, closeMin);
        }
        return new Date(year, month, date, closeHour, closeMin);
    }

    private static getOpeningTime(opening) {
        opening = this.convertTime12to24(opening).split(':');
        let openingHour = opening[0];
        let openingMin = opening[1];
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let date = new Date().getDate();
        return new Date(year, month, date, openingHour, openingMin);
    }

    private static convertTime12to24(time12h) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'pm') {
            hours = parseInt(hours, 10) + 12;
        }
        return hours + ':' + minutes;
    }
}