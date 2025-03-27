export default class DateTimeHelper {
  constructor() {}
  static getLocalDateTime(datetime, timezone) {
    return datetime.setZone(timezone);
  }
  static diffDateTime(datetimeA, datetimeB, unit) {
    return datetimeB.diff(datetimeA, unit);
  }
}
