import { CronExpressionParser } from "cron-parser";

export default class DateTimeHelper {
  constructor() {}
  static getLocalDateTime(datetime, timezone) {
    return datetime.setZone(timezone);
  }
  static diffDateTime(datetimeA, datetimeB, unit) {
    return datetimeB.diff(datetimeA, unit);
  }

  static matchCronExpreesionAndDate(cronExpressionString, date) {
    const cronExpression = CronExpressionParser.parse(cronExpressionString);
    return cronExpression.includesDate(date);
  }
}
