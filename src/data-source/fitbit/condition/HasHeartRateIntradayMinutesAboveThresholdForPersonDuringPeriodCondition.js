import BooleanHelper from "../../../helper/BooleanHelper";
import DateTimeHelper from "../../../helper/DateTimeHelper";
import FitbitDataHelper from "../helper/FitbitDataHelper";

export default class HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriodCondition {
  constructor() {}
  static async execute(condition, params) {
    const { userInfo, datetime } = params;
    const dateTimeUTC = datetime.toUTC();
    const localTimeForUser = DateTimeHelper.getLocalDateTime(
      dateTimeUTC,
      userInfo.timezone
    );

    const wearingLowerBoundMinutes =
      condition.criteria.wearingLowerBoundMinutes;
    const wearingDayLowerBoundCount =
      condition.criteria.wearingDayLowerBoundCount;

    const resultAggregator = condition.criteria.idRelationship;

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

    let minsList = [];
    if (userInfo.fitbitId != undefined && userInfo.fitbitId.length > 0) {
      minsList =
        await FitbitDataHelper.getUserFitbitWearingMinutesPerDayListDuringPeriod(
          userInfo.fitbitId,
          startDate,
          endDate
        );
    }
    
    const resultList = minsList.map((x) => {
      return x >= wearingLowerBoundMinutes;
    });

    const recordInfo = {
      minsList: minsList,
      resultList: resultList,
    };

    let result = false;
    if (wearingDayLowerBoundCount == undefined) {
      // require all days in range
      result = BooleanHelper.reduceBooleanArray(resultList, resultAggregator);
    } else {
      result = resultList.filter((x) => x).length >= wearingDayLowerBoundCount;
    }

    return {
      result,
      recordInfo,
    };
  }
}
