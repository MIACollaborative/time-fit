import { DateTime } from "luxon";

export default class MyUtility {
    //client;

    constructor() {

    }

    static getLocalTime(datetime, timezone) {
        return datetime.setZone(timezone);
    }

    static getWeekdayOrWeekend(datetime) {
        console.log(`getWeekdayOrWeekend: ${datetime.weekday}`);
        if (datetime.weekday < 6) {
            return "weekday";
        }
        else {
            return "weekend";
        }
    }


    static convertToUTCWithUTCDate(datetimeString, referenceUTC) {
        console.log(`convertToUTCWithUTCDate DateTime.fromISO(datetimeString).toUTC(): ${DateTime.fromISO(datetimeString).toUTC()}`);
        return DateTime.fromISO(datetimeString).toUTC().set({ year: referenceUTC.year, month: referenceUTC.month, day: referenceUTC.day, second: referenceUTC.second, millisecond: referenceUTC.millisecond });
    }

    static diffDateTime(datetimeA, datetimeB, unit){
        return datetimeB.diff(datetimeA, unit);
    }
}