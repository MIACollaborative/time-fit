import FitbitUpdateHelper from "../data-source/fitbit/FitbitUpdateHelper";
import DateTimeHelper from "../utility/DateTimeHelper";

export default class GenerateFitbitManualUpdateAction {
  constructor() {}
  static async execute(actionInfo, params) {
    const { datetime, userInfo } = params;
    const dateList = [];

    // now, generate a list of FitbitUpdates
    // 1. one for the (-1) date
    // 2. one for the (-7) date
    dateList.push(datetime.minus({ days: 1 }).startOf("day"));
    dateList.push(datetime.minus({ days: 2 }).startOf("day"));
    dateList.push(datetime.minus({ days: 3 }).startOf("day"));

    let proxyUpdateList = [];
    const collectionType = "activities";
    const ownerType = "walktojoy";

    if (userInfo.fitbitId != undefined) {
      const startTimeSpec =
        userInfo["joinAt"] != undefined
          ? {
              reference: "joinAtDate",
              offset: { type: "plus", value: { hours: 0 } },
            }
          : undefined;
      const endTimeSpec =
        userInfo["completeAt"] != undefined
          ? {
              reference: "completeAtDate",
              offset: { type: "plus", value: { hours: 0 } },
            }
          : undefined;

      if (startTimeSpec != undefined) {
        const startDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
          now,
          userInfo,
          startTimeSpec,
          "start"
        );

        const endDate = DateTimeHelper.generateStartOrEndDateTimeByReference(
          now,
          userInfo,
          endTimeSpec,
          "end"
        );

        for (let i = 0; i < dateList.length; i++) {
          const dateInfo = dateList[i];
          const proxyFitbitUpdate = {
            collectionType: collectionType,
            date: dateInfo.toFormat("yyyy-MM-dd"),
            ownerId: userInfo.fitbitId,
            ownerType: ownerType,
            subscriptionId: `${userInfo.fitbitId}-${collectionType}-${ownerType}`,
          };

          const isWithinScope = await DateTimeHelper.isDateStringWithinInterval(
            proxyFitbitUpdate.date,
            userInfo.timezone,
            startDate,
            endDate
          );

          if (isWithinScope) {
            proxyUpdateList.push(proxyFitbitUpdate);
          }
        }
      }
    }

    // insert updates to theFitbit update table
    let insertProxyUpdateResult = {};

    // version 2
    try {
      if (proxyUpdateList.length > 0) {
        insertProxyUpdateResult = await FitbitUpdateHelper.insertFitbitUpdateList(
          proxyUpdateList
        );
      }

      resultErrorMessage = `Attempt to insert: ${
        proxyUpdateList.length
      }, Insert: ${
        proxyUpdateList.length > 0 ? insertProxyUpdateResult.count : 0
      }`;
      resultStatus = "success";
      resultBody = JSON.stringify(insertProxyUpdateResult);
    } catch (error) {
      resultStatus = "failed";
      resultErrorMessage = error.message;
      resultBody = `[${error.code}] ${error.stack}`;
    }

    return {
      type: "generate-manual-fitbit-update",
      value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: resultBody,
      },
    };
  }
}
