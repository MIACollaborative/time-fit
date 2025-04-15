import DateTimeHelper from "../helper/DateTimeHelper";
import TaskLogHelper from "../helper/TaskLogHelper";

export default class HasTaskLogErrorDuringPeriodCondition {
  constructor() {}
  static async execute(condition, params) {
    const { userInfo, datetime } = params;
    const dateTimeUTC = datetime.toUTC();
    const localTimeForUser = DateTimeHelper.getLocalTime(
      dateTimeUTC,
      userInfo.timezone
    );

    const startDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
      localTimeForUser,
      userInfo,
      condition.criteria.period.start
    );
    const endDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
      localTimeForUser,
      userInfo,
      condition.criteria.period.end
    );

    // generic
    const errorList = await TaskLogHelper.getTaskLogWithErrorDuringPeriod(
      startDate,
      endDate
    );

    recordInfo.errorCount = errorList.length;
    recordInfo.errorTaskLogIdList = errorList.map((taskLogInfo) => {
      return taskLogInfo.id;
    });

    result = errorList.length > 0;

    return {
      result,
      recordInfo,
    };
  }
}
