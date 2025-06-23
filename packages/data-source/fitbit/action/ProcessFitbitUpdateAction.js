import TaskLogHelper from "@time-fit/helper/TaskLogHelper.js";
import FitbitUpdateHelper from "../helper/FitbitUpdateHelper.js";

export default class ProcessFitbitUpdateAction {
  type = "processFitbitUpdate";
  queryBreakTimeInMinutes = 5;
  constructor() {}
  static async execute(actionInfo, params) {
    const { datetime, userInfo } = params;

    const updateType = "notification";

    const recentUpdateList =
      await FitbitUpdateHelper.getFitbitUpdateByStatusWithLimit(
        updateType,
        0,
        theAction.prioritizeSystemUpdate,
        theAction.favorRecent
      );

    // try to find the taskLog for the past 4 mins

    const nowDateTime = DateTime.now();
    const beforeDateTime = nowDateTime.minus({
      minutes: ProcessFitbitUpdateAction.queryBreakTimeInMinutes,
    });

    const recentTaskLogList =
      await TaskLogHelper.findTaskLogWithActionTypeDuringPeriod(
        ProcessFitbitUpdateAction.type,
        beforeDateTime,
        nowDateTime,
        0
      );
    // next, filterd by those whose
    const recentTaskLogWithResultList = recentTaskLogList.filter((taskLog) => {
      return taskLog.executionResult.value.body.length > 0;
    });
    // now, extract the Fitbit ID
    let recentFitbitIdWithUpdateProcessed = [];

    recentTaskLogWithResultList.forEach((taskLog) => {
      taskLog.executionResult.value.body.forEach((fitbitUpdateLogList) => {
        fitbitUpdateLogList.forEach((fitbitUpdateLog) => {
          const fitbitId = fitbitUpdateLog["ownerId"];
          if (!recentFitbitIdWithUpdateProcessed.includes(fitbitId)) {
            recentFitbitIdWithUpdateProcessed.push(fitbitId);
          }
        });
      });
    });

    // now, the list have all the recent updates Fitbit Ids in 4 mins

    // ok, so now, filter the update list if they are about these ID
    let recentUpdateWithFitbitIdNotRecentlyProcessedList =
      recentUpdateList.filter((updateInfo) => {
        return !recentFitbitIdWithUpdateProcessed.includes(updateInfo.ownerId);
      });

    let filteredUpdateList = [];

    if (recentUpdateWithFitbitIdNotRecentlyProcessedList.length > 0) {
      // actually, if there are multiple, I can actually do multiple, LOL
      const updateForTheseFitbitIdList =
        await FitbitUpdateHelper.removeFitbitUpdateDuplicate(
          recentUpdateWithFitbitIdNotRecentlyProcessedList,
          false
        );

      // ok, one more step, I need to ensure that there is only one update for each Fitbit ID
      let fitbitIdInThisBatch = [];

      for (let i = 0; i < updateForTheseFitbitIdList.length; i++) {
        const updateInfo = updateForTheseFitbitIdList[i];
        const fitbitId = updateInfo.ownerId;

        if (!fitbitIdInThisBatch.includes(fitbitId)) {
          fitbitIdInThisBatch.push(fitbitId);
          filteredUpdateList.push(updateInfo);
        }
      }
    } else {
      // all have been recently queried, LOL
    }

    const queryTime = new Date();
    let resultList = [];
    for (let i = 0; i < filteredUpdateList.length; i++) {
      const fitbitUpdate = filteredUpdateList[i];

      // now, guard against a participant's study period
      const shouldProcess =
        await FitbitUpdateHelper.isFitbitUpdateDateWithinAppropriateScope(
          fitbitUpdate
        );

      if (shouldProcess) {
        // new
        let result =
          await FitbitDataHelper.queryAndStoreFitbitDataByFitbitUpdate(
            fitbitUpdate,
            true
          );
        resultList.push(result);
      }
    }

    resultStatus = "success";
    resultErrorMessage = "";

    for (let i = 0; i < resultList.length; i++) {
      let curResult = resultList[i];
      // one failed is failed
      if (curResult.value == "failed") {
        resultStatus = "failed";
        resultErrorMessage += `${curResult.data} - `;
      }
    }

    resultBody = resultList.map((result) => {
      return result.body;
    });

    const successResultList = resultList.filter((result) => {
      return result.value == "success";
    });

    for (let i = 0; i < successResultList.length; i++) {
      const fUpdate = successResultList[i].update;

      // version 2: use queryTime
      const updateOlderList =
        await FitbitUpdateHelper.updateFitbitUpdateStatusWithSameSignatureBeforeTime(
          fUpdate,
          "notification",
          "processed",
          queryTime
        );
    }

    return {
      type: "fitbit-process-update",
      value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: resultBody,
      },
    };
  }
}
