import { DateTime, Interval } from "luxon";
import TwilioHelper from "./TwilioHelper.mjs";

//import prisma from "./prisma.mjs";

import GeneralUtility from "../lib/GeneralUtility.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import ServerUtility from "../lib/ServerUtility.mjs";
import FitbitHelper from "./FitbitHelper.mjs";

export default class TaskExecutor {
  taskSpec;

  constructor() {}

  static async executeTaskForUserListForDatetime(taskSpec, userList, datetime) {
    // Step 1: use grouop to filter out the participants to be considered for this task
    //let userList = this.participantList;

    console.log(
      `executeTaskForUserListForDatetime taskSpec.enabled: ${taskSpec.enabled} for ${taskSpec.label}`
    );

    // just for reference in other part of the class.
    this.taskSpec = taskSpec;

    let taskResultList = [];

    if (taskSpec.enabled == false) {
      return taskResultList;
    }

    console.log(`executeTask: userList.length: ${userList.length}`);

    console.log(`executeTask: ignoreTimezone: ${taskSpec.ignoreTimezone}`);

    for (let i = 0; i < userList.length; i++) {
      let userInfo = userList[i];

      // username: "system-user"
      if (
        userInfo["username"] != "system-user" &&
        (userInfo["joinAt"] == null || userInfo["phase"] == "complete")
      ) {
        continue;
      }

      // prepare taskLog
      let taskLogObj = {};
      taskLogObj["taskLabel"] = taskSpec.label;
      taskLogObj["username"] = userInfo.username;
      //taskLogObj["preConditionResult"] = {};
      taskLogObj["randomizationResult"] = {};

      taskLogObj["messageLabel"] = "";
      taskLogObj["executionResult"] = {};
      taskLogObj["activationReasoning"] = [];

      // step 1: isTimezoneSet
      if (taskSpec.ignoreTimezone == false) {
        let isTimeZoneSetResult = GeneralUtility.isTimezoneSet(userInfo);
        console.log(
          `isTimezoneSet: user[${userInfo.username}]: ${isTimeZoneSetResult}`
        );

        taskLogObj["activationReasoning"].push({
          phase: "timezone-set",
          result: isTimeZoneSetResult,
          // do I want to store more?
          recordList: [],
        });
        if (!isTimeZoneSetResult) {
          taskLogObj["isActivated"] = false;
          if (taskSpec["preActivationLogging"]) {
            taskResultList.push(taskLogObj);
          }
          continue;
        }
      }

      // step 2: group membership
      let [isGroupResult, groupEvaluationRecordList] =
        TaskExecutor.isGroupForUser(taskSpec.group, userInfo);
      console.log(
        `isGroupForUser: user[${userInfo.username}]: ${isGroupResult}`
      );

      taskLogObj["activationReasoning"].push({
        phase: "group",
        result: isGroupResult,
        // do I want to store more?
        recordList: groupEvaluationRecordList,
      });

      if (!isGroupResult) {
        taskLogObj["isActivated"] = false;

        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      // step 3: checkpoint (time)
      let [isCheckPointResult, checkPointEvaluationRecordList] =
        TaskExecutor.isCheckPointForUser(
          taskSpec.checkPoint,
          userInfo,
          datetime
        );
      console.log(
        `isCheckPointResult: user[${userInfo.username}]: ${isCheckPointResult}`
      );

      taskLogObj["activationReasoning"].push({
        phase: "checkpoint",
        result: isCheckPointResult,
        // do I want to store more?
        recordList: checkPointEvaluationRecordList,
      });

      if (!isCheckPointResult) {
        taskLogObj["isActivated"] = false;
        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      // step 4: preconditions
      //let userNamePreConditionResultMap = {};

      let [checkResult, conditionEvaluationRecordList] =
        await TaskExecutor.isPreConditionMetForUser(
          taskSpec.preCondition,
          userInfo,
          datetime
        );

      console.log(
        `isPreConditionMetForUser [${userInfo.username}]: ${checkResult} - ${conditionEvaluationRecordList}`
      );

      taskLogObj["activationReasoning"].push({
        phase: "precondition",
        result: checkResult,
        // do I want to store more?
        recordList: conditionEvaluationRecordList,
      });

      /*
            userNamePreConditionResultMap[userInfo.username] = {
                result: checkResult,
                recordList: conditionEvaluationRecordList
            };
            taskLogObj["preConditionResult"] = userNamePreConditionResultMap[userInfo.username];
            */

      if (!checkResult) {
        taskLogObj["isActivated"] = false;
        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      /*
            if (taskLogObj["isActivated"] == false) {
                if (taskSpec["preActivationLogging"]) {
                    taskResultList.push(taskLogObj);
                }
                continue;
            }
            */

      // step 5: execute action
      let chanceChoice = TaskExecutor.obtainChoiceWithRandomization(
        taskSpec.randomization
      );
      let randomNumber = chanceChoice.randomNumber;
      let theAction = chanceChoice.theChoice.action;
      console.log(
        `executeTaskForUserListForDatetime (${
          userInfo.username
        }): chanceChoice: ${JSON.stringify(chanceChoice)}`
      );

      //taskLogObj["preConditionResult"] = userNamePreConditionResultMap[userInfo.username];

      taskLogObj["randomizationResult"] = chanceChoice;

      let compositeResult = await TaskExecutor.executeActionForUser(
        theAction,
        userInfo,
        datetime
      );

      taskLogObj["isActivated"] = true;
      taskLogObj["userInfoCache"] =
        GeneralUtility.extractUserInfoCache(userInfo);

      console.log(
        `executeTaskForUserListForDatetime.compositeResult: ${JSON.stringify(
          compositeResult
        )}`
      );
      taskLogObj["messageLabel"] = compositeResult["messageLabel"];
      taskLogObj["executionResult"] = compositeResult["executionResult"];

      taskResultList.push(taskLogObj);

      console.log(
        `executeTaskForUserListForDatetime (${
          userInfo.username
        }) taskLogObj: ${JSON.stringify(taskLogObj)}`
      );
    }

    return taskResultList;
  }

  static obtainChoiceWithRandomization(randomizationSpec) {
    console.log(`obtainChoiceWithRandomization: ${JSON.stringify(randomizationSpec)}`)
    // Example
    /*
        randomization:{
            // Note: could potentially separate this out to be random + action
            enabled: true, // true or false
            outcome: [
                {
                    value: true,
                    chance: 0.5,
                    action: {
                        type: "surveyId", // surveyId, or surveyGroup
                        surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                        surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                        avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                    }
                },
                {
                    value: false,
                    chance: 0.5,
                    action: {
                        type: "surveyId", // surveyId, or surveyGroup
                        surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                        surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                        avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                    }
                }
            ]
        }
        */

    // To Do: need to consider whether enabled: false makes sense
    if (randomizationSpec.enabled == false) {
      return {
        randomNumber: 0, theChoice: randomizationSpec["outcome"][0]
      };
    }

    // if not, then we need to do randomization
    // now, scan everything in the outcome list and use the "chance" to do the randomization

    const { randomNumber, theChoice } = TaskExecutor.randomizeSelection(
      randomizationSpec.outcome
    );

    /*
        let theAction = {
            type: "noAction"
        };
        if(theChoice != undefined){
            theAction = theChoice.action;
        }
        */

    return { randomNumber, theChoice };
  }

  static async executeActionForUser(theAction, userInfo, datetime) {
    console.log(
      `executeActionForUser[${
        this.taskSpec != undefined
          ? this.taskSpec.label
          : "[testing] no taskSpec"
      }] (${
        userInfo != undefined ? userInfo.username : "ignore"
      }): ${JSON.stringify(theAction)}`
    );
    let record = {
      messageLabel: "", //null,
      executionResult: null,
    };

    record.action = theAction;
    let messageInfo;
    let messageBody = "";
    let gifURL = "";
    let surveyURL = "";
    let resultStatus = "";
    let resultErrorMessage = "";
    let resultBody = undefined;

    console.log(`theAction.type: ${theAction.type}`);

    switch (theAction.type) {
      case "messageLabel":
        // find the message through messageLabel
        messageInfo = await DatabaseUtility.findMessageByLabel(
          theAction.messageLabel
        );
        console.log(
          `executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`
        );

        // for logging
        record.messageLabel = messageInfo.label;

        surveyURL = await GeneralUtility.extractSurveyLinkFromAction(theAction);

        console.log(`executeActionForUser surveyURL: ${surveyURL}`);

        messageBody = await DatabaseUtility.composeUserMessageForTwilio(
          userInfo,
          messageInfo,
          surveyURL
        );

        if (messageInfo.gif != undefined) {
          gifURL = `${process.env.ASSET_HOST_URL}/image/gif/${messageInfo.gif}.gif`;
        }

        console.log(`messageBody: ${messageBody}`);
        console.log(`Gif url: ${gifURL}`);

        record.executionResult = {
          type: "twilio",
          value: await TwilioHelper.sendMessage(
            userInfo.phone,
            messageBody,
            gifURL.length > 0 ? [gifURL] : []
          ),
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );
        break;
      case "messageLabelToResearchInvestigator":
        // find the message through messageLabel
        messageInfo = await DatabaseUtility.findMessageByLabel(
          theAction.messageLabel
        );
        console.log(
          `executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`
        );

        // for logging
        record.messageLabel = messageInfo.label;

        surveyURL = await GeneralUtility.extractSurveyLinkFromAction(theAction);

        console.log(`executeActionForUser surveyURL: ${surveyURL}`);

        messageBody = await DatabaseUtility.composeUserMessageForTwilio(
          userInfo,
          messageInfo,
          surveyURL
        );

        if (messageInfo.gif != undefined) {
          gifURL = `${process.env.ASSET_HOST_URL}/image/gif/${messageInfo.gif}.gif`;
        }

        console.log(`messageBody: ${messageBody}`);
        console.log(`Gif url: ${gifURL}`);

        record.executionResult = {
          type: "twilio",
          value: await TwilioHelper.sendMessage(
            process.env.RESEARCH_INVESTIGATOR_PHONE,
            messageBody,
            gifURL.length > 0 ? [gifURL] : []
          ),
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );
        break;
      case "messageGroup":
        messageInfo = await DatabaseUtility.findMessageByGroup(
          theAction.messageGroup,
          theAction.avoidHistory,
          userInfo.username
        );
        console.log(
          `executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`
        );

        // for logging
        record.messageLabel = messageInfo.label;

        surveyURL = GeneralUtility.extractSurveyLinkFromAction(theAction);
        console.log(`executeActionForUser surveyURL: ${surveyURL}`);

        messageBody = await DatabaseUtility.composeUserMessageForTwilio(
          userInfo,
          messageInfo,
          surveyURL
        );
        if (messageInfo.gif != undefined) {
          gifURL = `${process.env.ASSET_HOST_URL}/image/gif/${messageInfo.gif}.gif`;
        }
        console.log(`messageBody: ${messageBody}`);
        console.log(`Gif url: ${gifURL}`);
        record.executionResult = {
          type: "twilio",
          value: await TwilioHelper.sendMessage(
            userInfo.phone,
            messageBody,
            gifURL.length > 0 ? [gifURL] : []
          ),
        };
        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );
        break;
      case "generateManualFitbitUpdate":
        let dateList = [];

        // now, generate a list of FitbitUpdates
        // 1. one for the (-1) date
        // 2. one for the (-7) date
        dateList.push(datetime.minus({ days: 1 }).startOf("day"));
        dateList.push(datetime.minus({ days: 2 }).startOf("day"));
        dateList.push(datetime.minus({ days: 3 }).startOf("day"));

        let proxyUpdateList = [];
        let collectionType = "activities";
        let ownerType = "walktojoy";
        console.log(`userInfo: ${JSON.stringify(userInfo, null, 2)}`);

        if (userInfo.fitbitId != undefined) {
          for (let i = 0; i < dateList.length; i++) {
            let dateInfo = dateList[i];
            let proxyFitbitUpdate = {
              collectionType: collectionType,
              date: dateInfo.toFormat("yyyy-MM-dd"),
              ownerId: userInfo.fitbitId,
              ownerType: ownerType,
              subscriptionId: `${userInfo.fitbitId}-${collectionType}-${ownerType}`,
            };

            let isWithinScope =
              await DatabaseUtility.isFitbitUpdateDateWithinAppropriateScope(
                proxyFitbitUpdate
              );

            if (isWithinScope) {
              proxyUpdateList.push(proxyFitbitUpdate);
            }
          }
        }

        // insert updates to theFitbit update table
        let insertProxyUpdateResult = {};

        // version 2
        try {
          if (proxyUpdateList.length > 0) {
            insertProxyUpdateResult =
              await DatabaseUtility.insertFitbitUpdateList(proxyUpdateList);
          }

          resultErrorMessage = `Attempt to insert: ${
            proxyUpdateList.length
          }, Insert: ${
            proxyUpdateList.length > 0 ? insertProxyUpdateResult.count : 0
          }`;
          resultStatus = "success";
          resultBody = JSON.stringify(insertProxyUpdateResult);
        } catch (error) {
          console.error(error);
          resultStatus = "failed";
          resultErrorMessage = error.message;
          resultBody = `[${error.code}] ${error.stack}`;
        }

        // version 1
        /*
                resultStatus = insertProxyUpdateResult.count == proxyUpdateList.length ? "success" : "failed";
                resultErrorMessage = `Attempt to insert: ${proxyUpdateList.length}, Insert: ${insertProxyUpdateResult.count}`;
                resultBody = insertProxyUpdateResult;
                */

        record.executionResult = {
          type: "generate-manual-fitbit-update",
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );
        break;
      case "retrieveFitbitData":
        // Step 1: calculate the start date
        let nowDate = datetime; //DateTime.now();
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
            targetDate = nowDate
              .minus(theAction.retrievalStartDate.offset.value)
              .startOf("day");
          } else {
            targetDate = nowDate
              .plus(theAction.retrievalStartDate.offset.value)
              .startOf("day");
          }

          dateString = targetDate.toFormat("yyyy-MM-dd");
        }

        // version 1: manually call it

        const summaryResult =
          await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(
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
                dataType:
                  GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
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

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );
        break;
      case "processFitbitUpdate":
        console.log(
          `processFitbitUpdate: prioritizeSystemUpdate [${theAction.prioritizeSystemUpdate}], favorRecent [${theAction.favorRecent}]`
        );

        let updateType = "notification";

        let recentUpdateList =
          await DatabaseUtility.getFitbitUpdateByStatusWithLimit(
            updateType,
            0,
            theAction.prioritizeSystemUpdate,
            theAction.favorRecent
          );

        //console.log(`recentUpdateList: ${JSON.stringify(recentUpdateList, null, 2)}`);
        console.log(`recentUpdateList.length: ${recentUpdateList.length}`);

        // try to find the taskLog for the past 4 mins

        let nowDateTime = DateTime.now();
        let beforeDateTime = nowDateTime.minus({ minutes: 5 });

        let recentTaskLogList =
          await DatabaseUtility.findTaskLogWithActionTypeDuringPeriod(
            "processFitbitUpdate",
            beforeDateTime,
            nowDateTime,
            0
          );

        //console.log(`recentTaskLogList: ${JSON.stringify(recentTaskLogList, null, 2)}`);
        console.log(`recentTaskLogList.length: ${recentTaskLogList.length}`);

        // next, filterd by those whose
        let recentTaskLogWithResultList = recentTaskLogList.filter(
          (taskLog) => {
            return taskLog.executionResult.value.body.length > 0;
          }
        );

        //console.log(`recentTagLogWithResultList: ${JSON.stringify(recentTagLogWithResultList, null, 2)}`);
        console.log(
          `recentTaskLogWithResultList.length: ${recentTaskLogWithResultList.length}`
        );

        // now, extract the Fitbit ID
        let recentFitbitIdWithUpdateProcessed = [];

        recentTaskLogWithResultList.forEach((taskLog) => {
          taskLog.executionResult.value.body.forEach((fitbitUpdateLogList) => {
            fitbitUpdateLogList.forEach((fitbitUpdateLog) => {
              let fitbitId = fitbitUpdateLog["ownerId"];
              //console.log(`fitbitId: ${fitbitId}`);
              if (!recentFitbitIdWithUpdateProcessed.includes(fitbitId)) {
                recentFitbitIdWithUpdateProcessed.push(fitbitId);
              }
            });
          });
        });

        console.log(
          `recentFitbitIdWithUpdateProcessed: ${JSON.stringify(
            recentFitbitIdWithUpdateProcessed,
            null,
            2
          )}`
        );
        console.log(
          `recentFitbitIdWithUpdateProcessed.length: ${recentFitbitIdWithUpdateProcessed.length}`
        );

        // now, the list have all the recent updates Fitbit Ids in 4 mins

        // ok, so now, filter the update list if they are about these ID
        let recentUpdateWithFitbitIdNotRecentlyProcessedList =
          recentUpdateList.filter((updateInfo) => {
            return !recentFitbitIdWithUpdateProcessed.includes(
              updateInfo.ownerId
            );
          });

        //console.log(`recentUpdateWithFitbitIdNoteRecentlyProcessedList: ${JSON.stringify(recentUpdateWithFitbitIdNotRecentlyProcessedList, null, 2)}`);
        console.log(
          `recentUpdateWithFitbitIdNoteRecentlyProcessedList.length: ${recentUpdateWithFitbitIdNotRecentlyProcessedList.length}`
        );

        let filteredUpdateList = [];

        if (recentUpdateWithFitbitIdNotRecentlyProcessedList.length > 0) {
          // actually, if there are multiple, I can actually do multiple, LOL
          console.log(
            `There are some Fitbit Ids that are not recently processed!-------------------------------------------`
          );
          let updateForTheseFitbitIdList =
            await GeneralUtility.removeFitbitUpdateDuplicate(
              recentUpdateWithFitbitIdNotRecentlyProcessedList,
              false
            );

          // ok, one more step, I need to ensure that there is only one update for each Fitbit ID
          let fitbitIdInThisBatch = [];

          for (let i = 0; i < updateForTheseFitbitIdList.length; i++) {
            let updateInfo = updateForTheseFitbitIdList[i];
            let fitbitId = updateInfo.ownerId;

            if (!fitbitIdInThisBatch.includes(fitbitId)) {
              fitbitIdInThisBatch.push(fitbitId);
              filteredUpdateList.push(updateInfo);
            }
          }
        } else {
          // all have been recently queried, LOL
          console.log(
            `All Fitbit Ids that are not recently processed!-------------------------------------------`
          );
          // then, just pick a random update to perform
        }

        //console.log(`filteredUpdateList: ${JSON.stringify(filteredUpdateList, null, 2)}`);
        console.log(`filteredUpdateList.length: ${filteredUpdateList.length}`);
        // now, for each update, retrieve accordingly

        /*
                let resultList =  filteredUpdateList.map((fitbitUpdate) => {
                    return await 
                });
                */

        let queryTime = new Date();
        let resultList = [];
        for (let i = 0; i < filteredUpdateList.length; i++) {
          let fitbitUpdate = filteredUpdateList[i];
          console.log(`fitbitUpdate: ${fitbitUpdate}`);
          console.log(
            `typeof fitbitUpdate.createdAt: ${fitbitUpdate.createdAt}`
          );

          // now, guard against a participant's study period
          let shouldProcess =
            await DatabaseUtility.isFitbitUpdateDateWithinAppropriateScope(
              fitbitUpdate
            );

          if (shouldProcess) {
            // new
            let result =
              await DatabaseUtility.queryAndStoreFitbitDataByFitbitUpdate(
                fitbitUpdate,
                true
              );

            // old
            //let result = await DatabaseUtility.queryAndStoreFitbitSummaryByFitbitUpdate(fitbitUpdate, true, false);

            resultList.push(result);
          }
        }

        console.log(`resultList: ${JSON.stringify(resultList, null, 2)}`);
        console.log(`resultList.length: ${resultList.length}`);

        // queryAndStoreFitbitSummaryByFitbitUpdate

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

        // need to mark successful retrieval as done

        // sample result
        /*
                {
                    value: resultStatus,
                    data: resultErrorMessage,
                    compositeId: compositeId,
                    body: 
                }
                */

        let successResultList = resultList.filter((result) => {
          return result.value == "success";
        });

        console.log(
          `successResultList: ${JSON.stringify(successResultList, null, 2)}`
        );
        console.log(`successResultList.length: ${successResultList.length}`);

        for (let i = 0; i < successResultList.length; i++) {
          let fUpdate = successResultList[i].update;

          console.log(
            `fUpdate (${fUpdate.createdAt}): ${JSON.stringify(
              fUpdate,
              null,
              2
            )}`
          );

          // version 2: use queryTime
          const updateOlderList =
            await DatabaseUtility.updateFitbitUpdateStatusWithSameSignatureBeforeTime(
              fUpdate,
              "notification",
              "processed",
              queryTime
            );

          // version 1: use createdAt
          //const updateOlderList = await DatabaseUtility.updateFitbitUpdateStatusWithSameSignatureBeforeTime(fUpdate, "notification", "processed", fUpdate.createdAt);

          console.log(
            `updateOlderList (${fUpdate.createdAt}): ${JSON.stringify(
              updateOlderList,
              null,
              2
            )}`
          );

          console.log(
            `updateOlderList.length (${fUpdate.createdAt}): ${updateOlderList.length}`
          );
        }

        record.executionResult = {
          type: "fitbit-process-update",
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );

        break;
      case "processFitbitUpdateForIntraday":
        let processedUpdateList = [];
        let processedUpdateType =
          theAction.fitbitIntradayDataType ==
          GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP
            ? "processed"
            : `processed_${GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP}`;

        processedUpdateList =
          await DatabaseUtility.getFitbitUpdateByStatusWithLimit(
            processedUpdateType,
            1
          );

        console.log(
          `processedUpdateList: ${JSON.stringify(processedUpdateList, null, 2)}`
        );
        console.log(
          `processedUpdateList.length: ${processedUpdateList.length}`
        );

        let cleanUpdateList = await GeneralUtility.removeFitbitUpdateDuplicate(
          processedUpdateList,
          false
        );

        console.log(
          `cleanUpdateList: ${JSON.stringify(cleanUpdateList, null, 2)}`
        );
        console.log(`cleanUpdateList.length: ${cleanUpdateList.length}`);

        let qResultList = [];
        for (let i = 0; i < cleanUpdateList.length; i++) {
          let fitbitUpdate = cleanUpdateList[i];
          let result =
            await DatabaseUtility.queryAndStoreFitbitIntradayDataByFitbitUpdate(
              fitbitUpdate,
              theAction.fitbitIntradayDataType,
              true,
              false
            );

          qResultList.push(result);
        }

        console.log(`qResultList: ${JSON.stringify(qResultList, null, 2)}`);
        console.log(`qResultList.length: ${qResultList.length}`);

        // queryAndStoreFitbitSummaryByFitbitUpdate

        resultStatus = "success";
        resultErrorMessage = "";

        for (let i = 0; i < qResultList.length; i++) {
          let curResult = qResultList[i];
          // one failed is failed
          if (curResult.value == "failed") {
            resultStatus = "failed";
            resultErrorMessage += `${curResult.data} - `;
          }
        }

        resultBody = qResultList.map((result) => {
          return result.body;
          /*
                    result.body: [{
                        value: summaryResult.value,
                        ownerId: userInfo.fitbitId,
                        dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
                        dateTime: dateString,
                        dataPeriod: theAction.dataPeriod
                    }, {
                        value: heartrateResult.value,
                        ownerId: userInfo.fitbitId,
                        dataType: "activities-heart",
                        dateTime: dateString,
                        dataPeriod: theAction.dataPeriod
                    }]
                    */
        });

        // need to mark successful retrieval as done

        // sample result
        /*
                {
                    value: resultStatus,
                    data: resultErrorMessage,
                    compositeId: compositeId,
                    body: 
                }
                */

        let successResultOnlyList = qResultList.filter((result) => {
          return result.value == "success";
        });

        console.log(
          `successResultOnlyList: ${JSON.stringify(
            successResultOnlyList,
            null,
            2
          )}`
        );
        console.log(
          `successResultOnlyList.length: ${successResultOnlyList.length}`
        );

        for (let i = 0; i < successResultOnlyList.length; i++) {
          let fUpdate = successResultOnlyList[i].update;

          console.log(
            `fUpdate (${fUpdate.createdAt}): ${JSON.stringify(
              fUpdate,
              null,
              2
            )}`
          );

          const updateOlderList =
            await DatabaseUtility.updateFitbitUpdateStatusWithSameSignatureBeforeTime(
              fUpdate,
              processedUpdateType,
              `${processedUpdateType}_${theAction.fitbitIntradayDataType}`,
              fUpdate.createdAt
            );

          console.log(
            `updateOlderList (${fUpdate.createdAt}): ${JSON.stringify(
              updateOlderList,
              null,
              2
            )}`
          );

          console.log(
            `updateOlderList.length (${fUpdate.createdAt}): ${updateOlderList.length}`
          );
        }

        record.executionResult = {
          type: `fitbit-process-update-for-intraday_${theAction.fitbitIntradayDataType}`,
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );

        break;
      case "activateParticipant":
        let result = await DatabaseUtility.updateUserInfo(userInfo, {
          phase: "intervention",
          activateAt: DateTime.utc().toISO(),
        });

        resultStatus = "success";
        resultErrorMessage = "";
        resultBody = result;

        record.executionResult = {
          type: "activate-participant",
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );

        break;
      case "setPersonalizedDailyStepsGoal":
        // yesterday
        const endDateTime = DateTime.now().minus({ days: 1 });
        const endDateString = endDateTime.toFormat("yyyy-MM-dd");
          console.log(`endDateString: ${endDateString}`);
        // look over the past 30 days, including yesterday
        const startDateString = endDateTime
          .minus({ days: 30 })
          .toFormat("yyyy-MM-dd");

          // print the dates
          console.log(`startDateString: ${startDateString}`);
          
        const wearingDateStepsList =
          await DatabaseUtility.getUserFitbitDailyStepsForWearingDaysDuringPeriodById(
            userInfo.fitbitId,
            startDateString,
            endDateString,
            "steps",
            60 * 8,
            3
          );

          // print the list
          console.log(`wearingDateStepsList: ${JSON.stringify(wearingDateStepsList, null, 2)}`);

        // (average recorded steps for most recent 3 valid days1) * randomly choose (0.6 | 0.8 | 1.2) rounded to the nearest 100
        let averageStepGoal = 0;

        const randomMultiplier = [0.6, 0.8, 1.2][
          ServerUtility.getRandomIntInclusiveRNG(0, 2)
        ];

        // print the random multiplier
        console.log(`randomMultiplier: ${randomMultiplier}`);

        if (wearingDateStepsList.length === 3) {
          // calculate average step goals
          averageStepGoal =
            wearingDateStepsList.reduce((total, next) => total + next.steps, 0) /
            wearingDateStepsList.length;

        } else {
          // grab the curren daily step goal
          averageStepGoal = (
            await FitbitHelper.getActivityGoalsForFitbitID(
              fitbitID,
              userInfo.accessToken,
              "daily"
            )
          )["goals"]["steps"];
        }

        // print the average step goal
        console.log(`averageStepGoal: ${averageStepGoal}`);

        const roundedStepGoal =
          Math.floor((averageStepGoal * randomMultiplier) / 100) * 100;

          let finalStepGoal = roundedStepGoal;

          if(roundedStepGoal < 2000){
            finalStepGoal = 2000;
          }
          else if(roundedStepGoal > 15000){
            finalStepGoal = 15000;
          }

          // print the final goal
          console.log(`finalStepGoal: ${finalStepGoal}`);

          const goalSettingMeta = {
            averageStepGoal: averageStepGoal,
            randomMultiplier: randomMultiplier,
            roundedStepGoal: roundedStepGoal,
            finalStepGoal: finalStepGoal,
            wearingDateGoalList: wearingDateStepsList,
            createdAt: DateTime.now().toISO(),
          };

        let updateResult = await DatabaseUtility.updateUserInfo(userInfo, {
          dailyStepsGoal: finalStepGoal,
          dailyStepsGoalMeta: goalSettingMeta
        });

        // print the update result
        console.log(`updateResult: ${JSON.stringify(updateResult, null, 2)}`);

        resultStatus = "success";
        resultErrorMessage = "";
        resultBody = {
          ...goalSettingMeta
        };

        record.executionResult = {
          type: "set-personal-daily-steps-goal",
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };

        console.log(
          `executeActionForUser record.executionResult: ${JSON.stringify(
            record.executionResult
          )}`
        );

        break;
      default:
        // noAction
        // do nothing
        //record.executionResult = theAction;

        record.executionResult = {
          type: "no-action",
          value: {
            status: "success",
            errorMessage: "",
            body: {},
          },
        };

        break;
    }

    console.log(`executeActionForUser record: ${JSON.stringify(record)}`);
    return record;
  }

  static randomizeSelection(choiceList) {
    // Example
    /*
        [
            {
                value: true,
                chance: 0.5,
                action: {
                    type: "surveyId", // surveyId, or surveyGroup
                    surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                    surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                    avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                }
            },
            {
                value: false,
                chance: 0.5,
                action: {
                    type: "surveyId", // surveyId, or surveyGroup
                    surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                    surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                    avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                }
            }
        ]
        */

    // ok, here is the strategy.
    // Step 1: get a random number between 0 - 1

    // Step 2: continually deduct the chance from the random number
    // if the random number become zero (or does it needs to be smaller?)

    // [0, 1)

    let theChoice = undefined;

    let randNumber = Math.random();

    let allowance = randNumber;

    for (let i = 0; i < choiceList.length; i++) {
      let choice = choiceList[i];

      let cChance = choice.chance;

      allowance = allowance - cChance;

      // Example: 0.5 + 0.5
      // since 0 will be count as the first 0.5, so if allowance == 0, it should be count as the next one
      if (allowance < 0) {
        theChoice = choice;
        break;
      }
    }

    // now, what to do if theChoice is undefined?
    // meaning, the randomization indicate not to take action

    return {
      randomNumber: randNumber,
      theChoice: theChoice,
    };
  }

  static async isPreConditionMetForUser(conditionSpec, userInfo, dateTime) {
    console.log(
      `${this.name} isPreConditionMetForUser[${
        this.taskSpec != undefined
          ? this.taskSpec.label
          : "[testing] no taskSpec"
      }] for ${userInfo.username}`
    );

    let result = true;

    if (
      conditionSpec.enabled == false ||
      conditionSpec.conditionList.length == 0
    ) {
      result = true;
      return [result, []];
    }

    // example
    /*
        preCondition: {
            enabled: true,
            conditionRelationship: "and",
            conditionList: [
                {
                    type: "person",
                    criteria: {
                        phase: "baseline"
                    }
                },
                {
                    type: "surveyFilledByThisPerson",
                    criteria: {
                        idList: ["SV_81aWO5sJPDhGZNA"],
                        idRelationship: "and",
                        period: {
                            //start:{},
                            end:{
                                reference: "now", 
                                offset: {type: "plus", value: {hours: 0}}
                            }
                        }
                    }
                }
            ]
        }
        */

    let evaluationReportList = [];

    let conditionEvaluationResultList = [];

    for (let i = 0; i < conditionSpec.conditionList.length; i++) {
      let condition = conditionSpec.conditionList[i];
      let [checkResult, recordInfo] =
        await TaskExecutor.checkOneConditionForUser(
          condition,
          userInfo,
          dateTime
        );
      console.log(`checkResult: ${checkResult}, recordInfo: ${recordInfo}\n`);

      conditionEvaluationResultList.push(checkResult);

      // this is the part that provides the structure for a condition evaluation record
      evaluationReportList.push({
        step: `precondition-${i}`,
        result: checkResult,
        condition: condition,
        record: recordInfo,
      });
    }

    result = true;
    // now, check conditionRelationship to see if it is and/or (all or one)

    result = GeneralUtility.reduceBooleanArray(
      conditionEvaluationResultList,
      conditionSpec.conditionRelationship
    );
    console.log(
      `${this.name} isPreConditionMetForUser[${
        userInfo.username
      }]: result: ${result}, resultList: ${conditionEvaluationResultList}, resultReocrdList: ${JSON.stringify(
        evaluationReportList,
        null,
        2
      )}`
    );

    return [result, evaluationReportList];
  }

  static async checkOneConditionForUser(condition, userInfo, dateTime) {
    console.log(
      `${this.name} checkOneConditionForUser[${
        this.taskSpec != undefined
          ? this.taskSpec.label
          : "[testing] no taskSpec"
      }] type: ${condition.type}`
    );
    let result = true;
    let startDate = undefined;
    let endDate = undefined;
    let messageLabel = undefined;
    let wearingLowerBoundMinutes = undefined;
    let wearingDayLowerBoundCount = undefined;
    let aggregatedMinutes = undefined;

    let recordInfo = {};

    //console.log(`${this.name} checkOneConditionForUser dateTime: ${dateTime}`);
    let dateTimeUTC = dateTime.toUTC();
    //console.log(`${this.name} checkOneConditionForUser dateTimeUTC: ${dateTimeUTC}`);
    let localTimeForUser = GeneralUtility.getLocalTime(
      dateTimeUTC,
      userInfo.timezone
    );
    console.log(
      `${this.name} checkOneConditionForUser localTimeForUser: ${localTimeForUser}`
    );

    switch (condition.type) {
      case "person":
        result = GeneralUtility.isUserInfoPropertyValueMatched(
          userInfo,
          condition.criteria
        );
        recordInfo.userInfoPartial =
          GeneralUtility.extractUserInfoPropertyValueMatched(
            userInfo,
            condition.criteria
          );
        break;
      case "surveyFilledByThisPerson":
        startDate = undefined;
        endDate = undefined;

        /*
                    start:{
                        reference: "now", 
                        offset: {type: "plus", value: {hours: 0}}
                    }
                */

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.start,
          "start"
        );
        /*
                if (condition.criteria.period.start != undefined) {
                    switch (condition.criteria.period.start.reference) {
                        case "now":
                            startDate = localTimeForUser.toUTC();// DateTime.utc();
                            break;
                        case "today":
                            // I need to use datetime
                            // Step 1: convert to a participant's local time
                            startDate = localTimeForUser.startOf("day").toUTC();
                            break;                            
                        default:
                            break;
                    }
                    startDate = GeneralUtility.operateDateTime(startDate, condition.criteria.period.start.offset.value, condition.criteria.period.start.offset.type);
                }
                else {
                    // use a very early time: year 2000
                    startDate = DateTime.utc(2000);
                }
                */

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] startDate: ${startDate}`
        );

        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );
        /*
                if (condition.criteria.period.end != undefined) {
                    switch (condition.criteria.period.end.reference) {
                        case "now":
                            endDate = localTimeForUser.toUTC();// DateTime.utc();
                            break;
                        case "today":
                            endDate = localTimeForUser.endOf("day").toUTC();
                            break;
                        default:
                            break;
                    }
                    endDate = GeneralUtility.operateDateTime(endDate, condition.criteria.period.end.offset.value, condition.criteria.period.end.offset.type);
                }
                else {
                    // use now
                    endDate = localTimeForUser.toUTC();// DateTime.utc();
                }
                */

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] endDate: ${endDate}`
        );

        let surveyFillResultList = [];
        let surveyResponseTimeListMap = {};

        for (let i = 0; i < condition.criteria.idList.length; i++) {
          let surveyId = condition.criteria.idList[i];
          let responseList =
            await DatabaseUtility.findSurveyResponseDuringPeriod(
              surveyId,
              startDate,
              endDate
            );

          console.log(
            `findSurveyResponoseDuringPeriod responseList: ${responseList}`
          );

          console.log(
            `findSurveyResponoseDuringPeriod responseList.length > 0: ${
              responseList.length > 0
            }`
          );

          // now, filter by the person
          responseList = responseList.filter((responseInfo) => {
            return responseInfo.participantId == userInfo.username;
          });

          surveyResponseTimeListMap[surveyId] = responseList.map(
            (responseInfo) => {
              return responseInfo.dateTime;
            }
          );

          console.log(
            `findSurveyResponoseDuringPeriod by this person responseList.length > 0: ${
              responseList.length > 0
            }`
          );

          surveyFillResultList.push(responseList.length > 0);
        }

        recordInfo.surveyResponseTimeListMap = surveyResponseTimeListMap;

        result = GeneralUtility.reduceBooleanArray(
          surveyFillResultList,
          condition.criteria.idRelationship
        );
        break;
      case "messageSentDuringPeriod":
        startDate = undefined;
        endDate = undefined;

        messageLabel = startDate =
          GeneralUtility.generateStartOrEndDateTimeByReference(
            localTimeForUser,
            userInfo,
            condition.criteria.period.start,
            "start"
          );

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] startDate: ${startDate}`
        );

        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] endDate: ${endDate}`
        );

        // now query the database to find out whether actionResult with a messageLabel exist during this period

        let taskLogList =
          await DatabaseUtility.findTaskLogWithMessageLabelDuringPeriod(
            condition.criteria.messageLabel,
            startDate,
            endDate
          );

        console.log(
          `messageSentDuringPeriod taskLogList.length: ${taskLogList.length}`
        );

        console.log(
          `messageSentDuringPeriod taskLogList.length > 0: ${
            taskLogList.length > 0
          }`
        );

        // now, filter by the person, and messageLabel
        taskLogList = taskLogList.filter((taskLogInfo) => {
          return taskLogInfo.username == userInfo.username;
        });

        recordInfo.messageSentCount = taskLogList.length;
        recordInfo.messageSentTimeList = taskLogList.map((taskLogInfo) => {
          return taskLogInfo.createdAt;
        });

        console.log(
          `messageSentDuringPeriod (${condition.criteria.messageLabel}) for [${userInfo.username}] taskLogList.length: ${taskLogList.length}`
        );

        console.log(
          `messageSentDuringPeriod (${condition.criteria.messageLabel}) for [${
            userInfo.username
          }] taskLogList.length > 0: ${taskLogList.length > 0}`
        );

        result = taskLogList.length > 0;
        break;
      case "hasFitbitUpdateForPersonByDateRange":
        startDate = undefined;
        endDate = undefined;

        /*
                    start:{
                        reference: "now", 
                        offset: {type: "plus", value: {hours: 0}}
                    }
                */

        //console.log(`${this.name} checkOneConditionForUser dateTime: ${dateTime}`);
        //let dateTimeUTC = dateTime.toUTC();
        //console.log(`${this.name} checkOneConditionForUser dateTimeUTC: ${dateTimeUTC}`);
        //let localTimeForUser = GeneralUtility.getLocalTime(dateTimeUTC, userInfo.timezone);
        //console.log(`${this.name} checkOneConditionForUser localTimeForUser: ${localTimeForUser}`);

        //console.log(`${this.name} checkOneConditionForUser condition.criteria.start: ${JSON.stringify(condition.criteria.period.start, null, 2)}`);

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.start,
          "start"
        );
        /*
                if (condition.criteria.period.start != undefined) {
                    switch (condition.criteria.period.start.reference) {
                        case "now":
                            startDate = localTimeForUser.toUTC();// DateTime.utc();
                            break;
                        case "today":
                            // I need to use datetime
                            // Step 1: convert to a participant's local time
                            startDate = localTimeForUser.startOf("day").toUTC();
                            break;
                        default:
                            break;
                    }
                    startDate = GeneralUtility.operateDateTime(startDate, condition.criteria.period.start.offset.value, condition.criteria.period.start.offset.type);
                }
                else {
                    // use a very early time: year 2000
                    startDate = DateTime.utc(2000);
                }
                */

        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );
        /*
                if (condition.criteria.period.end != undefined) {
                    switch (condition.criteria.period.end.reference) {
                        case "now":
                            endDate = localTimeForUser.toUTC(); // DateTime.utc();
                            break;
                        case "today":
                            endDate = localTimeForUser.endOf("day").toUTC();
                            break;
                        default:
                            break;
                    }
                    endDate = GeneralUtility.operateDateTime(endDate, condition.criteria.period.end.offset.value, condition.criteria.period.end.offset.type);
                }
                else {
                    // use now
                    endDate = localTimeForUser.toUTC(); // DateTime.now().endOf("day").toUTC();
                }
                */

        let updateList = [];

        if (userInfo.fitbitId != undefined && userInfo.fitbitId.length > 0) {
          updateList =
            await DatabaseUtility.getUserFitbitUpdateDuringPeriodByIdAndOwnerType(
              userInfo.fitbitId,
              startDate,
              endDate,
              "user"
            );
        }

        console.log(
          `${this.name} checkOneConditionForUser type: ${condition.type}: start: ${startDate}, end: ${endDate}, updateList.length: ${updateList.length}`
        );

        recordInfo.fitbitUpdateCount = updateList.length;
        recordInfo.fitbitUpdateTimeList = updateList.map((itemInfo) => {
          return itemInfo.createdAt;
        });

        result = updateList.length > 0;
        break;
      case "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange":
        startDate = undefined;
        endDate = undefined;

        wearingLowerBoundMinutes = condition.criteria.wearingLowerBoundMinutes;
        wearingDayLowerBoundCount =
          condition.criteria.wearingDayLowerBoundCount;

        // reuse idRelationship... not the ideal case

        let resultAggregator = condition.criteria.idRelationship;

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.start,
          "start"
        );
        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );

        // version 2: move it to function
        let minsList = [];
        if (userInfo.fitbitId != undefined && userInfo.fitbitId.length > 0) {
          minsList =
            await DatabaseUtility.getUserFitbitWearingMinutesPerDayListDuringPeriod(
              userInfo.fitbitId,
              startDate,
              endDate
            );
        }
        let resultList = minsList.map((x) => {
          return x >= wearingLowerBoundMinutes;
        });

        recordInfo.minsList = minsList;
        recordInfo.resultList = resultList;

        console.log(
          `${this.name} checkOneConditionForUser type: ${condition.type}: start: ${startDate},  end: ${endDate}, wearingLowerBoundMinutes: ${wearingLowerBoundMinutes}, idRelationship: ${resultAggregator}`
        );

        console.log(
          `${this.name} checkOneConditionForUser minsList: ${minsList}`
        );
        console.log(
          `${this.name} checkOneConditionForUser resultList: ${resultList}`
        );

        if (wearingDayLowerBoundCount == undefined) {
          // require all days in range
          result = GeneralUtility.reduceBooleanArray(
            resultList,
            resultAggregator
          );
        } else {
          // having wearingDayLowerBoundCount will ignore resultAggregator
          result =
            resultList.filter((x) => x).length >= wearingDayLowerBoundCount; // GeneralUtility.reduceBooleanArray(resultList, resultAggregator);
        }

        console.log(`${this.name} checkOneConditionForUser result: ${result}`);

        break;

      case "hasTaskLogErrorByDateRange":
        startDate = undefined;
        endDate = undefined;

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.start,
          "start"
        );
        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );

        // generic
        let errorList = await DatabaseUtility.getTaskLogWithErrorDuringPeriod(
          startDate,
          endDate
        );

        console.log(
          `${this.name} checkOneConditionForUser type: ${
            condition.type
          }: start: ${startDate}, end: ${endDate}, errorList: ${JSON.stringify(
            errorList,
            null,
            2
          )}`
        );

        recordInfo.errorCount = errorList.length;
        recordInfo.errorTaskLogIdList = errorList.map((taskLogInfo) => {
          return taskLogInfo.id;
        });

        result = errorList.length > 0;
        break;
      case "timeInPeriod":
        /*
                {
	
                    type: timeInPeriod,
                    
                    criteria: {
                        
                        start:{
                        
                            reference: "activateAtDate",
                            // Need to make sure that the minute and seconds do not get in the way of calculatioon
                            offset: {type: "plus", value: {days: 7}}
                            
                        },
                    
                        end:{
                        
                            reference: "joinAt",
                            
                            offset: {type: "plus", value: {hours: 0}}
                            
                        }
                    
                    }
                
                }
                */

        startDate = undefined;
        endDate = undefined;

        /*
                console.log(`${this.name} checkOneConditionForUser[${this.taskSpec != undefined? this.taskSpec.label: "[testing] no taskSpec"}] condition: ${JSON.stringify(condition, null, 2)}`);

                console.log(`${this.name} checkOneConditionForUser[${this.taskSpec != undefined? this.taskSpec.label: "[testing] no taskSpec"}] condition.criteria.start.reference: ${condition.criteria.start.reference}`);

                console.log(`${this.name} checkOneConditionForUser[${this.taskSpec != undefined? this.taskSpec.label: "[testing] no taskSpec"}] userInfo: ${JSON.stringify(userInfo)}`);

                console.log(`${this.name} checkOneConditionForUser[${this.taskSpec != undefined? this.taskSpec.label: "[testing] no taskSpec"}] userInfo.joinAt: ${userInfo.joinAt}`);
                console.log(`${this.name} checkOneConditionForUser[${this.taskSpec != undefined? this.taskSpec.label: "[testing] no taskSpec"}] userInfo.timezone: ${userInfo.timezone}`);
                */

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.start,
          "start"
        );

        /*
                if (condition.criteria.start != undefined) {
                    switch (condition.criteria.start.reference) {
                        case "now":
                            startDate = localTimeForUser; // DateTime.utc();
                            break;
                        case "activateAtDate":
                            // GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).startOf("day").toUTC();
                            startDate = GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).startOf("day");
                            break;
                        case "joinAtDate":
                            // GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).startOf("day").toUTC();
                            
                            console.log(`startDate-typeof userInfo.joinAt: ${typeof userInfo.joinAt}`);
                            console.log(`startDate-DateTime.fromISO(userInfo.joinAt): ${DateTime.fromISO(userInfo.joinAt)}`);
                            console.log(`startDate-GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.joinAt), userInfo.timezone): ${GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.joinAt), userInfo.timezone)}`);
                            startDate = GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.joinAt), userInfo.timezone).startOf("day");
                            console.log(`startDate: ${startDate}`);
                            break;
                        default:
                            break;
                    }
                    startDate = GeneralUtility.operateDateTime(startDate, condition.criteria.start.offset.value, condition.criteria.start.offset.type);
                }
                else {
                    // use a very early time: year 2000
                    startDate = DateTime.utc(2000);
                }
                */

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] startDate: ${startDate}`
        );

        endDate = GeneralUtility.generateStartOrEndDateTimeByReference(
          localTimeForUser,
          userInfo,
          condition.criteria.period.end,
          "end"
        );

        /*
                if (condition.criteria.end != undefined) {
                    switch (condition.criteria.end.reference) {
                        case "now":
                            endDate = localTimeForUser;// DateTime.utc();
                            break;
                        case "activateAtDate":
                            // GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).startOf("day").toUTC();
                            endDate = GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).endOf("day");
                            break;
                        case "joinAtDate":
                            // GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.activateAt), userInfo.timezone).startOf("day").toUTC();
                            endDate = GeneralUtility.getLocalTime(DateTime.fromISO(userInfo.joinAt), userInfo.timezone).endOf("day");
                            break;
                        default:
                            break;
                    }
                    endDate = GeneralUtility.operateDateTime(endDate, condition.criteria.end.offset.value, condition.criteria.end.offset.type);

                    
                }
                else {
                    // use now
                    endDate = localTimeForUser; // DateTime.utc();
                }
                */

        // default to be inclusive
        // version 2: with "period"
        if (
          condition.criteria.period.end.inclusive == undefined ||
          (condition.criteria.period.end.inclusive != undefined &&
            condition.criteria.period.end.inclusive == true)
        ) {
          // inclusive
          endDate = endDate.plus({ milliseconds: 1 });
        }

        // version 1: without "period"
        /*
                if (condition.criteria.end.inclusive == undefined || (condition.criteria.end.inclusive != undefined && condition.criteria.end.inclusive == true)) {
                    // inclusive
                    endDate = endDate.plus({ "milliseconds": 1 });
                }
                */

        console.log(
          `${this.name} checkOneConditionForUser[${
            this.taskSpec != undefined
              ? this.taskSpec.label
              : "[testing] no taskSpec"
          }] endDate: ${endDate}`
        );

        // now, need to check if dateTime is in between this start and endDate
        // add one milliseconds so that the end time is included

        console.log(`dateTimeUTC: ${dateTimeUTC}`);

        console.log(`startDate: ${startDate}, endDate: ${endDate}`);

        let validInterval = Interval.fromDateTimes(startDate, endDate);

        console.log(`validInterval: ${validInterval}`);

        let containDateTime = validInterval.contains(dateTime.toUTC());

        console.log(`containDateTime: ${containDateTime}`);

        recordInfo.dateTime = dateTime;
        recordInfo.validInterval = validInterval;

        result = containDateTime;
        break;
      default:
        break;
    }

    console.log(
      `${this.name} checkOneConditionForUser type: ${condition.type}: ${result} (opposite: ${condition.opposite})`
    );

    if (condition.opposite != undefined && condition.opposite == true) {
      result = !result;
    }
    console.log(
      `${this.name} checkOneConditionForUser (before return) result: ${result} (opposite: ${condition.opposite})`
    );
    return [result, recordInfo];
  }

  static isGroupForUser(groupSpec, userInfo) {
    let result = false;
    let evaluationReportList = [];

    if (groupSpec.type == "all") {
      result = true;
      evaluationReportList.push({
        step: "group-type",
        target: "all",
      });
    } else if (groupSpec.type == "list") {
      let isListed = false;
      if (groupSpec.list.includes(userInfo.username)) {
        isListed = true;
      }
      result = isListed;
      evaluationReportList.push({
        step: "group-list",
        target: groupSpec.list,
      });
    } else if (groupSpec.type == "group") {
      let groupMatched = false;
      Object.keys(groupSpec.membership).forEach((groupName, index) => {
        if (groupSpec.membership[groupName].includes(userInfo[groupName])) {
          groupMatched = true;
        }

        evaluationReportList.push({
          step: `group-group-${index}`,
          target: { key: groupName, value: groupSpec.membership[groupName] },
          source: userInfo[groupName],
        });
      });

      result = groupMatched;
    }

    // verion 2
    return [result, evaluationReportList];

    // version 1
    return false;
  }

  static isCheckPointForUser(checkPoint, userInfo, now) {
    // Will return true if the time is right for this user. If not, return false;
    let result = false;
    let evaluationReportList = [];

    // checkPoint example
    /*
        checkPoint: {
            type: "absolute", // absolute vs. relative
            reference: {
                weekday:[1,2,3,4,5,6,7],
                type: "fixed", // fixed or preference
                value: "8:00 PM" // (if preference) (wakeupTime, bedTime, createdAt)
            },
            offset: {
                type: "plus",
                value: {hours: 0}
            },
            repeat: {
                interval: { minutes: 5 }, // every x (5) minutes
                range: {
                    // after: starting from that reference, before, strating befoore that reference
                    before: {
                        // will execute within distance (100 mins) prior to the reference point
                        distance: { minutes: 20 * 5 },
                    },
                    after: {
                        // will execute within distance (100 mins) after the reference point
                        distance: { minutes: 20 * 5 },
                    }
                }
            }
        },
        */

    // step 0: if checkPoint is to be Ignore
    if (checkPoint.type == "ignore") {
      result = true;
      evaluationReportList.push({
        step: "checkpoint-type",
        target: "ignore",
      });
      return [result, evaluationReportList];
      //return true;
    }

    // step 1: identify what time attribute should be used for comparison

    // step 1.1: use timezone to get local time
    //let now = DateTime.now();
    console.log(
      `isCheckPointForUser[${
        this.taskSpec != undefined
          ? this.taskSpec.label
          : "[testing] no taskSpec"
      }] (${userInfo.username}) now: ${now}`
    );
    let nowUTC = now.toUTC();
    console.log(`isCheckPointForUser nowUTC: ${nowUTC}`);

    console.log(`isCheckPointForUser timezone: ${userInfo.timezone}`);

    let localTimeForUser = GeneralUtility.getLocalTime(now, userInfo.timezone);
    let localWeekIndex = localTimeForUser.weekday;

    console.log(`isCheckPointForUser.localTimeForUser: ${localTimeForUser}`);
    console.log(`isCheckPointForUser.localWeekIndex: ${localWeekIndex}`);

    //DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({year: nowUTC.year, month: nowUTC.month, day: nowUTC.day, second: nowUTC.second, millisecond: nowUTC.millisecond});

    // Step 1.2: check whether the weekday even pass (if it is the right day)
    // [Note] I will likely have to deal with people go to bed at 12:00 AM later

    evaluationReportList.push({
      step: "checkpoint-dayofweek",
      target: checkPoint.reference.weekIndexList,
      souce: localWeekIndex,
    });

    if (!checkPoint.reference.weekIndexList.includes(localWeekIndex)) {
      // this is not the right week index
      //console.log(`isCheckPointForUser weekIndex not included: ${localWeekIndex}/${checkPoint.reference.weekIndexList}`);

      result = false;
      return [result, evaluationReportList];
    } else {
      //console.log(`isCheckPointForUser weekIndex included: ${localWeekIndex}/${checkPoint.reference.weekIndexList}`);
    }

    // ok. so now at least the weekday (or weekend) is correct (or included)

    let targetTime = undefined;
    //let localTargetTime = undefined;

    let diffDateTime = undefined;

    //console.log(`isCheckPointForUser checkPoint.reference.type: ${checkPoint.reference.type}`);
    //console.log(`isCheckPointForUser checkPoint.reference.value: ${checkPoint.reference.value}`);

    if (checkPoint.reference.type == "fixed") {
      // value: "8:00 PM"
      let hourMinuteString = checkPoint.reference.value;

      // version 4: use the localTime
      // D: 9/4/2017
      // f: 8/6/2014, 1:07 PM
      let timeString = `${localTimeForUser.toFormat("D")}, ${hourMinuteString}`;

      // new
      let syncedReferenceTime = DateTime.fromFormat(timeString, "f", {
        zone: userInfo.timezone,
      });

      // original
      //let tempReferenceTime = DateTime.fromFormat(hourMinuteString, "t", { zone: userInfo.timezone });

      // Version 2: we need the local year/month/day/hours/minutes to be all correct
      //let [tempDateTime, syncedReferenceTime] = GeneralUtility.syncToFirstDateTimeBeforeUnit(localTimeForUser, tempReferenceTime, "hour");

      // Version 1: this will give us the same hours in the local timezone, according to the machine time (which is not greeat)
      //let userReferenceTime = DateTime.fromFormat(hourMinuteString, "t", { zone: userInfo.timezone });

      targetTime = syncedReferenceTime; //userReferenceTime;

      // version 1, which is fine, but for consistency, use localTime for comparison to be clear
      /*
            let userReferenceUTCTime = GeneralUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);
            targetTime = userReferenceUTCTime;
            */

      // need to check if the time is on the right date locally
      console.log(`isCheckPointForUser.targetTime: ${targetTime}`);
    } else if (checkPoint.reference.type == "preference") {
      // (if preference) (wakeupTime, bedTime, createdAt)
      // get local time

      let referenceTimePropertyName = "";

      //console.log(`isCheckPointForUser checkPoint.reference.value: ${checkPoint.reference.value}`);

      if (checkPoint.reference.value == "wakeupTime") {
        if (localWeekIndex <= 5) {
          referenceTimePropertyName = "weekdayWakeup";
        } else {
          referenceTimePropertyName = "weekendWakeup";
        }
      } else if (checkPoint.reference.value == "bedTime") {
        if (localWeekIndex <= 5) {
          referenceTimePropertyName = "weekdayBed";
        } else {
          referenceTimePropertyName = "weekendBed";
        }
      } else {
        referenceTimePropertyName = checkPoint.reference.value;
      }

      //console.log(`isCheckPointForUser referenceTimePropertyName: ${referenceTimePropertyName}`);
      //console.log(`isCheckPointForUser referenceHourMinuteString: ${referenceTimePropertyName}`);

      // version 4: use the localTime
      // D: 9/4/2017
      // f: 8/6/2014, 1:07 PM
      let timeString = `${localTimeForUser.toFormat("D")}, ${DateTime.fromISO(
        userInfo[referenceTimePropertyName],
        { zone: userInfo.timezone }
      ).toFormat("t")}`;

      // new
      let syncedReferenceTime = DateTime.fromFormat(timeString, "f", {
        zone: userInfo.timezone,
      });
      targetTime = syncedReferenceTime; //userReferenceTime;

      // version 3
      /*
            let tempReferenceTime = DateTime.fromFormat(hourMinuteString, "t", { zone: userInfo.timezone });
            let [tempDateTime, syncedReferenceTime] = GeneralUtility.syncToFirstDateTimeBeforeUnit(localTimeForUser, tempReferenceTime, "hour");
            */

      // version 2, use localTime
      // this will not give us the same date

      /*
            let userReferenceTime = DateTime.fromISO(userInfo[referenceTimePropertyName], { zone: userInfo.timezone });
            //console.log(`isCheckPointForUser userReferenceTime: ${userReferenceTime}, type: ${typeof userReferenceTime}`);
            targetTime = GeneralUtility.setToReferenceDateAndSeconds(userReferenceTime, localTimeForUser);
            */

      // version 1, use UTC, but create confusion and even errors after offset and sync date
      /*
            let userReferenceUTCTime = GeneralUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);

            console.log(`isCheckPointForUser userReferenceUTCTime: ${userReferenceUTCTime}`);

            targetTime = userReferenceUTCTime;
            */
      console.log(`isCheckPointForUser.targetTime: ${targetTime}`);
    }

    // absolute vs. relative
    //console.log(`isCheckPoint checkPoint.type: ${checkPoint.type}`);
    if (checkPoint.type == "absolute") {
      // do nothing
    } else if (checkPoint.type == "relative") {
      //console.log(`isCheckPointForUser checkPoint.offset.value: ${JSON.stringify(checkPoint.offset.value)}`);
      if (checkPoint.offset.type == "plus") {
        targetTime = targetTime.plus(checkPoint.offset.value);
      } else if (checkPoint.offset.type == "minus") {
        targetTime = targetTime.minus(checkPoint.offset.value);
      }
    }

    console.log(`targetTime after offset: ${targetTime}`);

    // now, considering repeat
    /*
        repeat: {
            interval: { minutes: 5 }, // every x (5) minutes
            range: {
                // after: starting from that reference, before, strating befoore that reference
                before: {
                    // will execute within distance (100 mins) prior to the reference point
                    distance: { minutes: 20 * 5 },
                },
                after: {
                    // will execute within distance (100 mins) after the reference point
                    distance: { minutes: 20 * 5 },
                }
            }
        }
        
        */

    // v2
    // ['months', 'days', 'hours']
    // do this so that minutes will be an integer, all the additional errors can be embodied by the seconds
    diffDateTime = GeneralUtility.diffDateTime(targetTime, nowUTC, [
      "minutes",
      "seconds",
    ]);
    let diffObj = diffDateTime.toObject();

    let secondsThreshold = 20;

    // v1
    // diffDateTime = GeneralUtility.diffDateTime(targetTime, nowUTC, "minutes");

    if (checkPoint.repeat == undefined) {
      //diffDateTime = GeneralUtility.diffDateTime(targetTime, nowUTC, "minutes");
      evaluationReportList.push({
        step: "checkpoint-time-no-repeat",
        target: targetTime,
        souce: nowUTC,
      });

      //console.log(`isCheckPoint diffDateTime: ${diffDateTime}, minutes: ${diffObj.minutes}, hours: ${diffObj.minutes / 60}`);
      console.log(
        `isCheckPoint diffDateTime: ${diffDateTime}, seconds: ${
          diffObj.seconds
        }, minutes: ${diffObj.minutes}, hours: ${diffObj.minutes / 60}`
      );

      if (
        diffObj.minutes != 0 ||
        Math.abs(diffObj.seconds) >= secondsThreshold
      ) {
        result = false;
      } else {
        result = true;
      }
    } else {
      // ok, we need to consider repeatable version of the task
      // Step 1, check if nowUTC is within the range?

      let intervalStart = targetTime;
      let intervalEnd = targetTime;
      // before
      if (checkPoint.repeat.range.before != undefined) {
        intervalStart = targetTime.minus(
          checkPoint.repeat.range.before.distance
        );
      }

      // after
      if (checkPoint.repeat.range.after != undefined) {
        intervalEnd = targetTime.plus(checkPoint.repeat.range.after.distance);
      }

      // add a millisecond just so that the interval is inclusive of both ends
      intervalEnd = intervalEnd.plus({ milliseconds: 1 });

      // now check if the current time is within the interval
      let correctStartEndInterval = Interval.fromDateTimes(
        intervalStart,
        intervalEnd
      );

      console.log(
        `isCheckPoint: correctStartEndInterval: ${correctStartEndInterval}`
      );
      let containDateTime = correctStartEndInterval.contains(nowUTC);

      // ok, even if it contains the timestamp, I still need to verify the distance between nowUTC and whether it is the

      let isMultiplier =
        diffObj.minutes % checkPoint.repeat.interval.minutes == 0 &&
        diffObj.seconds < secondsThreshold;

      console.log(
        `isCheckPoint diffDateTime: ${diffDateTime}, seconds: ${diffObj.seconds}, minutes: ${diffObj.minutes}, small interval: ${checkPoint.repeat.interval.minutes}, containDateTime: ${containDateTime}, duration is the multiplier of small interval: ${isMultiplier}`
      );

      evaluationReportList.push({
        step: "checkpoint-time-repeat",
        target: {
          interval: correctStartEndInterval,
          diffDateTime: diffDateTime,
          diffMinutes: diffObj.minutes,
          diffSeconds: diffObj.seconds,
        },
        souce: {
          time: nowUTC,
          intervalMinutes: checkPoint.repeat.interval.minutes,
        },
      });

      if (containDateTime && isMultiplier) {
        result = true;
      } else {
        result = false;
      }
    }

    console.log(`isCheckPointForUser: ${result}`);

    return [result, evaluationReportList];
  }
}
