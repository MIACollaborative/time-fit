import { DateTime, Interval } from "luxon";
import UserInfoHelper from "../helper/UserInfoHelper.js";
import DateTimeHelper from "../helper/DateTimeHelper.js";
import RandomizationHelper from "../helper/RandomizationHelper.js";
export default class TaskExecutor {
  taskSpec;
  static checkPointPreferenceTimeStringExtractionFunction;
  static actionTypeMap = {};

  constructor() {}
  
  static registerCheckPointPreferenceTimeStringExtractionFunction(func) {
    TaskExecutor.checkPointPreferenceTimeStringExtractionFunction = func;
  }

  static registerAction(name, actionClass) {
    TaskExecutor.actionTypeMap[name] = actionClass;
  }

  static async executeTaskForUserListForDate(taskSpec, userList, date) {
    const datetime = DateTime.fromJSDate(date);

    console.log(
      `executeTaskForUserListForDate taskSpec.enabled: ${taskSpec.enabled} for ${taskSpec.label}`
    );

    // just for reference in other part of the class.
    this.taskSpec = taskSpec;

    let taskResultList = [];

    for (let i = 0; i < userList.length; i++) {
      let userInfo = userList[i];

      // prepare taskLog
      let taskLogObj = {};
      taskLogObj["taskLabel"] = taskSpec.label;
      taskLogObj["username"] = userInfo.username;
      taskLogObj["randomizationResult"] = {};
      taskLogObj["executionResult"] = {};
      taskLogObj["activationReasoning"] = [];
      taskLogObj["isActivated"] = true;

      // step 1: is user info ready
      // this is very much like a pre-condition, but just a system-enforce one.

      const [isUserInfoReadyResult, userInfoEvaluationRecordList] =
        await TaskExecutor.isUserInfoReadyForUser(taskSpec, userInfo);

      taskLogObj["activationReasoning"].push({
        phase: "user-info",
        result: isUserInfoReadyResult,
        recordList: userInfoEvaluationRecordList,
      });

      taskLogObj["isActivated"] = isUserInfoReadyResult;

      if (!taskLogObj["isActivated"]) {
        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      // TO DO: disable for now, should enable later
      // step 2: group membership

      let [isGroupResult, groupEvaluationRecordList] =
        TaskExecutor.isGroupForUser(taskSpec.group, userInfo);

      taskLogObj["activationReasoning"].push({
        phase: "group",
        result: isGroupResult,
        recordList: groupEvaluationRecordList,
      });

      taskLogObj["isActivated"] = isGroupResult;

      if (!taskLogObj["isActivated"]) {
        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      // step 3: checkpoint (time)
      const [isCheckPointResult, checkPointEvaluationRecordList] =
        TaskExecutor.isCheckPointForUser(taskSpec.checkPoints, userInfo, date);
      console.log(
        `isCheckPointResult: user[${userInfo.username}]: ${isCheckPointResult}`
      );

      taskLogObj["activationReasoning"].push({
        phase: "checkpoints",
        result: isCheckPointResult,
        // do I want to store more?
        recordList: checkPointEvaluationRecordList,
      });

      taskLogObj["isActivated"] = isCheckPointResult;

      if (!taskLogObj["isActivated"]) {
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

      if (!checkResult) {
        taskLogObj["isActivated"] = false;
        if (taskSpec["preActivationLogging"]) {
          taskResultList.push(taskLogObj);
        }
        continue;
      }

      // step 5: execute action
      const chanceChoice = TaskExecutor.obtainChoiceWithRandomization(
        taskSpec.outcomes
      );
      const randomNumber = chanceChoice.randomNumber;
      const theAction = chanceChoice.theChoice.action;
      console.log(
        `executeTaskForUserListForDate (${
          userInfo.username
        }): chanceChoice: ${JSON.stringify(chanceChoice)}`
      );

      taskLogObj["randomizationResult"] = chanceChoice;

      const compositeResult = await TaskExecutor.executeActionForUser(
        theAction,
        userInfo,
        datetime
      );

      taskLogObj["isActivated"] = true;
      taskLogObj["userInfoCache"] =
        UserInfoHelper.extractUserInfoCache(userInfo);

      console.log(
        `executeTaskForUserListForDate.compositeResult: ${JSON.stringify(
          compositeResult
        )}`
      );
      taskLogObj["messageLabel"] = compositeResult["messageLabel"];
      taskLogObj["executionResult"] = compositeResult["executionResult"];

      taskResultList.push(taskLogObj);

      console.log(
        `executeTaskForUserListForDate (${
          userInfo.username
        }) taskLogObj: ${JSON.stringify(taskLogObj)}`
      );
    }

    return taskResultList;
  }

  static obtainChoiceWithRandomization(outcomesSpec) {
    if (outcomesSpec.randomizationEnabled == false) {
      return {
        randomNumber: 0,
        theChoice: outcomesSpec["outcomeList"][0],
      };
    }
    const { randomNumber, theChoice } = TaskExecutor.randomizeSelection(
      outcomesSpec.outcomeList
    );
    return { randomNumber, theChoice };
  }

  static async executeActionForUser(theAction, userInfo, datetime) {
    
    const record = {
      action: theAction,
      executionResult: TaskExecutor.actionTypeMap[theAction.type].execute(theAction, { userInfo, datetime })
    };

    return record;
  }

  static randomizeSelection(choiceList) {
    let theChoice = undefined;
    const randNumber = RandomizationHelper.getRandomNumber(); // Math.random();

    let allowance = randNumber;

    for (let i = 0; i < choiceList.length; i++) {
      const choice = choiceList[i];
      const cChance = choice.chance;
      allowance = allowance - cChance;
      // Example: 0.5 + 0.5
      // since 0 will be count as the first 0.5, so if allowance == 0, it should be count as the next one
      if (allowance < 0) {
        theChoice = choice;
        break;
      }
    }

    return {
      randomNumber: randNumber,
      theChoice: theChoice,
    };
  }

  static async isUserInfoReadyForUser(taskSpec, userInfo) {
    let result = true;
    let logList = [];

    if (taskSpec.ignoreTimezone == false) {
      const isTimeZoneSetResult = UserInfoHelper.isPropertySet(
        userInfo,
        "timezone"
      );

      result = isTimeZoneSetResult;

      logList.push({
        target: "timezone-set",
        result: isTimeZoneSetResult,
      });
    }

    return [result, logList];
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
    let localTimeForUser = DateTimeHelper.getLocalTime(
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

        startDate = GeneralUtility.generateStartOrEndDateTimeByReference(
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
      result = groupSpec.list.includes(userInfo.username);
      evaluationReportList.push({
        step: "group-list",
        target: groupSpec.list,
      });
    } else if (groupSpec.type == "group") {
      let groupMatched = false;

      const membershipList = Object.keys(groupSpec.membership);
      for (let i = 0; i < membershipList.length; i++) {
        const groupName = membershipList[i];
        if (
          groupSpec.membership[groupName].includes(
            userInfo["groupMembership"][groupName]
          )
        ) {
          groupMatched = true;
        }

        evaluationReportList.push({
          step: `group-${i}`,
          target: { key: groupName, value: groupSpec.membership[groupName] },
          source: userInfo[groupName],
        });

        if (groupMatched) {
          break;
        }
      }

      result = groupMatched;
    }

    return [result, evaluationReportList];
  }

  static isCheckPointForUser(checkPoints, userInfo, now) {
    let result = false;
    let evaluationReportList = [];

    const datetime = DateTime.fromJSDate(now);

    if (checkPoints.enabled == false) {
      result = true;
      evaluationReportList.push({
        step: "checkpoints-enabled",
        target: checkPoints.enabled,
      });
      return [result, evaluationReportList];
    }

    // now iterate through the pointList with a loop
    for (let i = 0; i < checkPoints.pointList.length; i++) {
      const checkPoint = checkPoints.pointList[i];

      let targetTime = undefined;
      let checkPointResult = false;
      const nowUTC = datetime.toUTC();
      const localTimeForUser = DateTimeHelper.getLocalDateTime(
        datetime,
        userInfo.timezone
      );

      if (checkPoint.reference.type == "spec") {
        // print type
        console.log(`checkPoint.reference.type: ${checkPoint.reference.type}`);
        const weekIndexList =
          checkPoint.reference.value.dateCriteria.weekIndexList;
        const localWeekIndex = localTimeForUser.weekday;

        evaluationReportList.push({
          step: `checkpoint-${i}-dayofweek`,
          target: weekIndexList,
          source: localWeekIndex,
        });

        if (!weekIndexList.includes(localWeekIndex)) {
          result = false;
          return [result, evaluationReportList];
        }

        const dateTimeRefeneceType = checkPoint.reference.value.timeStringType;

        // now check the time
        let hourMinuteString = "";

        if (dateTimeRefeneceType == "fixed") {
          hourMinuteString = checkPoint.reference.value.timeString;
        } else if (dateTimeRefeneceType == "preference") {
          const preferenceString = checkPoint.reference.value.timeString;
          hourMinuteString =
            TaskExecutor.checkPointPreferenceTimeStringExtractionFunction(
              userInfo,
              checkPoint,
              preferenceString,
              now
            );
        }

        // print hourMinuteString
        console.log(`hourMinuteString: ${hourMinuteString}`);

        const timeString = `${localTimeForUser.toFormat(
          "D"
        )}, ${hourMinuteString}`;
        const syncedReferenceTime = DateTime.fromFormat(timeString, "f", {
          zone: userInfo.timezone,
        });

        // print syncedReferenceTime
        console.log(`syncedReferenceTime: ${syncedReferenceTime}`);
        targetTime = syncedReferenceTime;
        // print targetTime
        console.log(`isCheckPointForUser: targetTime: ${targetTime}`);
        // now, see if there is an offset. If so, add it.
        if (checkPoint.type == "relative") {
          if (checkPoint.offset.type == "plus") {
            targetTime = targetTime.plus(checkPoint.offset.value);
          } else if (checkPoint.offset.type == "minus") {
            targetTime = targetTime.minus(checkPoint.offset.value);
          }
        }

        targetTime = targetTime.set({ second: 0, millisecond: 0 });
        const upToMinuteNow = nowUTC.set({ second: 0, millisecond: 0 });

        const diffDateTime = DateTimeHelper.diffDateTime(targetTime, upToMinuteNow, [
          "minutes",
          "seconds",
        ]);
        
        const diffObj = diffDateTime.toObject();

        if (
          diffObj.minutes != 0
        ) {
          checkPointResult = false;
        } else {
          checkPointResult = true;
        }
      } else if (checkPoint.reference.type == "cron") {
        // print type
        console.log(`checkPoint.reference.type: ${checkPoint.reference.type}`);
        targetTime = localTimeForUser;

        // if there is offset, reverse it.
        if (checkPoint.type == "relative") {
          if (checkPoint.offset.type == "plus") {
            targetTime = targetTime.minus(checkPoint.offset.value);
          } else if (checkPoint.offset.type == "minus") {
            targetTime = targetTime.plus(checkPoint.offset.value);
          }
        }
        targetTime = targetTime.set({ second: 0, millisecond: 0 });

        // now, use target time to match the cron expression
        const cronExpressionString = checkPoint.reference.value;
        checkPointResult = DateTimeHelper.matchCronExpreesionAndDate(
          cronExpressionString,
          targetTime.toJSDate()
        );

        // wait, but this is exact match, up to the seconds, even...

        // ok, now need to check if target time matchs the cron expression, considering the timezone (local time)
        // referencce cronstrue to see if I can use its utility
        // https://github.com/bradymholt/cronstrue
      }

      // print targetTime
      console.log(`isCheckPointForUser: targetTime: ${targetTime}`);
      evaluationReportList.push({
        step: `checkpoint-${i}-time`,
        target: targetTime,
        source: nowUTC,
      });

      if (checkPointResult == true) {
        result = true;
        break;
      }
    }

    console.log(`isCheckPointForUser: ${result}`);

    return [result, evaluationReportList];
  }
}
