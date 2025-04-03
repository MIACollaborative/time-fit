import { CronExpressionParser } from "cron-parser";
import { DateTime, Interval } from "luxon";
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

  static async isDateStringWithinInterval(
    dateString,
    timezone,
    startDate,
    endDate
  ) {
    const targetDate = DateTime.fromISO(dateString, { zone: timezone });
    const validInterval = Interval.fromDateTimes(startDate, endDate);
    const result = validInterval.contains(targetDate);
    return result;
  }
  static generateStartOrEndDateTimeByReference(
    targetDateTime,
    userInfo,
    timeDefinition,
    startOrEnd = "start"
  ) {
    let resultDateTime;

    let startEndOfUnit = "no";
    let startEndUnit = "day";

    if (timeDefinition != undefined) {
      switch (timeDefinition.reference) {
        case "now":
          break;
        case "today":
          startEndOfUnit = startOrEnd;
          break;
        case "activateAtDate":
          startEndOfUnit = startOrEnd;
          break;
        case "joinAtDate":
          startEndOfUnit = startOrEnd;
          break;
        case "completeAtDate":
          startEndOfUnit = startOrEnd;
          break;
        default:
          break;
      }

      resultDateTime = DateTimeHelper.generateDateTimeByReference(
        targetDateTime,
        userInfo,
        timeDefinition.reference,
        startEndOfUnit,
        startEndUnit
      );
      resultDateTime = DateTimeHelper.operateDateTime(
        resultDateTime,
        timeDefinition.offset.value,
        timeDefinition.offset.type
      );
    } else {
      switch (startOrEnd) {
        case "start":
          resultDateTime = DateTime.utc(2000);
          break;
        case "end":
          resultDateTime = targetDateTime; //.toUTC();
          break;
        default:
          break;
      }
    }
    return resultDateTime;
  }

  static generateDateTimeByReference(
    targetDateTime,
    userInfo,
    reference,
    startEndOfUnit = "no",
    startEndUnit = "day"
  ) {
    let resultDateTime = undefined;

    switch (reference) {
      case "now":
        resultDateTime = targetDateTime;
        break;
      case "today":
        resultDateTime = targetDateTime;
        break;
      case "activateAtDate":
        resultDateTime = DateTimeHelper.getLocalDateTime(
          DateTime.fromISO(userInfo.activateAt),
          userInfo.timezone
        );
        break;
      case "joinAtDate":
        resultDateTime = DateTimeHelper.getLocalDateTime(
          DateTime.fromISO(userInfo.joinAt),
          userInfo.timezone
        );
        break;
      case "completeAtDate":
        resultDateTime = DateTimeHelper.getLocalDateTime(
          DateTime.fromISO(userInfo.completeAt),
          userInfo.timezone
        );
        break;
      default:
        break;
    }

    switch (startEndOfUnit) {
      case "start":
        resultDateTime = resultDateTime.startOf(startEndUnit);
        break;
      case "end":
        resultDateTime = resultDateTime.endOf(startEndUnit);
        break;
      default:
        break;
    }

    return resultDateTime;
  }

  static operateDateTime(dateTime, offset, operator) {
    let result = undefined;
    switch (operator) {
      case "plus":
        result = dateTime.plus(offset);
        break;
      case "minus":
        result = dateTime.minus(offset);
        break;
      default:
        break;
    }

    return result;
  }
}
