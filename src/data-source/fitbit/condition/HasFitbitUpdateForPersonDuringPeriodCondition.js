import DateTimeHelper from "../../../helper/DateTimeHelper";
import FitbitUpdateHelper from "../helper/FitbitUpdateHelper";

export default class HasFitbitUpdateForPersonDuringPeriodCondition {
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
      condition.criteria.period.start,
      "start"
    );

    const endDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
      localTimeForUser,
      userInfo,
      condition.criteria.period.end,
      "end"
    );

    let updateList = [];

    if (userInfo.fitbitId != undefined && userInfo.fitbitId.length > 0) {
      updateList =
        await FitbitUpdateHelper.getUserFitbitUpdateDuringPeriodByIdAndOwnerType(
          userInfo.fitbitId,
          startDate,
          endDate,
          "user"
        );
    }

    recordInfo.fitbitUpdateCount = updateList.length;

    recordInfo.fitbitUpdateTimeList = updateList.map((itemInfo) => {
      return itemInfo.createdAt;
    });

    result = updateList.length > 0;
    return {
      result,
      recordInfo,
    };
  }
}
