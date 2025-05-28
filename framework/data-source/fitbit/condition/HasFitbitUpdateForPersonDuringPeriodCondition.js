import DateTimeHelper from "../../../helper/DateTimeHelper";
import FitbitUpdateHelper from "../helper/FitbitUpdateHelper";

export default class HasFitbitUpdateForPersonDuringPeriodCondition {
  constructor() {}
  static async execute(condition, params) {
    const { userInfo, datetime } = params;
    const dateTimeUTC = datetime.toUTC();
    const localTimeForUser = DateTimeHelper.getLocalDateTime(
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

    const result = updateList.length > 0;

    const recordInfo = {
      fitbitUpdateCount: updateList.length,
      fitbitUpdateTimeList: updateList.map((itemInfo) => {
        return itemInfo.createdAt;
      }),
    };

    return {
      result,
      recordInfo,
    };
  }
}
