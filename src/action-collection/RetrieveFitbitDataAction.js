import DatabaseHelper from "../utility/DatabaseHelper";
import DateTimeHelper from "../utility/DateTimeHelper";
import FitbitDataHelper from "../utility/FitbitDataHelper";

export default class RetrieveFitbitDataAction {
  constructor() {}
  static async execute(actionInfo, params) {
    const { datetime, userInfo } = params;

    let targetDate = nowDate;
    let dateString;
    let numOfDays = 1;
    // Step 1.1: determine number of days
    switch (theAction.dataPeriod) {
      case "1d":
        numOfDays = 1;
        break;
      case "7d":
        numOfDays = 7;
        break;
      default:
        numOfDays = 1;
        break;
    }
    if (theAction.retrievalStartDate.reference == "today") {
      // the only case being supported for now
      if (theAction.retrievalStartDate.offset.type == "minus") {
        targetDate = datetime
          .minus(theAction.retrievalStartDate.offset.value)
          .startOf("day");
      } else {
        targetDate = datetime
          .plus(theAction.retrievalStartDate.offset.value)
          .startOf("day");
      }

      dateString = targetDate.toFormat("yyyy-MM-dd");
    }

    // version 1: manually call it

    const summaryResult =
      await FitbitDataHelper.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(
        userInfo,
        targetDate,
        true,
        numOfDays,
        false
      );
    const heartrateResult =
      await DatabaseUtility.queryAndStoreFitbitHeartRateAtTargetDateForUser(
        userInfo,
        targetDate,
        true,
        numOfDays,
        false
      );

    resultStatus =
      summaryResult.value == "success" && heartrateResult.value == "success"
        ? "success"
        : "failed";

    // eResult.value.errorMessage
    resultErrorMessage = "";
    if (summaryResult.value == "failed") {
      resultErrorMessage += `${summaryResult.data}`;
    }
    if (heartrateResult.value == "failed") {
      resultErrorMessage += `${heartrateResult.data}`;
    }

    // result = `type: ${eResult.type}, status: ${eResult.value.status}, errorMessage: ${eResult.value.errorMessage}`;

    record.executionResult = {
      type: "fitbit",
      value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: [
          {
            value: summaryResult.value,
            ownerId: userInfo.fitbitId,
            dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
            dateTime: dateString,
            dataPeriod: theAction.dataPeriod,
          },
          {
            value: heartrateResult.value,
            ownerId: userInfo.fitbitId,
            dataType: "activities-heart",
            dateTime: dateString,
            dataPeriod: theAction.dataPeriod,
          },
        ],
      },
    };
  }
}
