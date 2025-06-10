import voca from "voca";
import StringHelper from "@time-fit/helper/StringHelper";
import SurveyResponseHelper from "@time-fit/helper/SurveyResponseHelper";
import DateTimeHelper from "@time-fit/helper/DateTimeHelper";
import TaskLogHelper from "@time-fit/helper/TaskLogHelper";
export default class AppHelper {
  constructor() {}
  static isPreferredNameSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.preferredName != undefined && userInfo.preferredName.length > 0
    );
  }

  static isWakeBedTimeSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.weekdayWakeup != undefined &&
      userInfo.weekdayBed != undefined &&
      userInfo.weekendWakeup != undefined &&
      userInfo.weekendBed != undefined
    );
  }

  static isFitbitReminderTurnOff(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitReminderTurnOff != undefined &&
      userInfo.fitbitReminderTurnOff
    );
  }

  static isWalkToJoySaveToContacts(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.saveWalkToJoyToContacts != undefined &&
      userInfo.saveWalkToJoyToContacts
    );
  }

  static isWalkSetTo10(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.autoWalkTo10 != undefined && userInfo.autoWalkTo10;
  }

  static isTimezoneSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.timezone != undefined;
  }
  static doesFitbitInfoExist(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitId != null &&
      userInfo.fitbitId.length > 0 &&
      userInfo.accessToken != null &&
      userInfo.accessToken.length > 0 &&
      userInfo.refreshToken != null &&
      userInfo.refreshToken.length > 0
    );
  }

  static async composeUserMessageForTwilio(
    userInfo,
    messageInfo,
    surveyURL = ""
  ) {
    let result = "";

    if (
      messageInfo["interventionMessage"] != undefined &&
      messageInfo["interventionMessage"].length > 0
    ) {
      result += messageInfo["interventionMessage"] + " ";
    }

    if (
      messageInfo["walkMessage"] != undefined &&
      messageInfo["walkMessage"].length > 0
    ) {
      result += messageInfo["walkMessage"] + " ";
    }

    const placeholderReplaceResult =
      await AppHelper.replacePlaceholderFromMessage(
        result,
        userInfo,
        surveyURL
      );

    result = placeholderReplaceResult.message;

    if (
      placeholderReplaceResult.surveyReplaced == false &&
      surveyURL.length > 0
    ) {
      // now a randomSurvey
      result += `${surveyURL}?study_code=${userInfo.username} .`;
    }

    return result;
  }

  static async replacePlaceholderFromMessage(message, userInfo, surveyLink) {
    let result = {
      nameReplaced: false,
      surveyReplaced: false,
      message: message,
    };

    if (result.message.includes("[PID]")) {
      result.message = voca.replaceAll(
        result.message,
        "[PID]",
        userInfo.username
      );
      result.nameReplaced = true;
    }

    if (result.message.includes("[name]")) {
      result.message = voca.replaceAll(
        result.message,
        "[name]",
        userInfo.preferredName
      );
      result.nameReplaced = true;
    }

    if (result.message.includes("<link>")) {
      const surveySeg = `${surveyLink}?study_code=${userInfo.username}`;
      result.message = voca.replaceAll(result.message, "<link>", surveySeg);
      result.surveyReplaced = true;
    }

    if (result.message.includes("[7-day-average-steps]")) {
      const lastWeekInterval =
        DateTimeHelper.getLastWeekAsIntervalFromDateTime();
      const value =
        await FitbitStatisticsHelper.getUserFitbitAverageDailyStepsDuringPeriodById(
          userInfo.fitbitId,
          lastWeekInterval.start.toISODate(),
          lastWeekInterval.end.toISODate()
        );
      const restrictedValue = value.toFixed(1);
      result.message = voca.replaceAll(
        result.message,
        "[7-day-average-steps]",
        restrictedValue
      );
      result.surveyReplaced = true;
    }

    if (result.message.includes("[7-day-walks-over-10mins]")) {
      const lastWeekInterval =
        DateTimeHelper.getLastWeekAsIntervalFromDateTime();
      const walkActivityList =
        await FitbitDataHelper.getUserFitbitActivityListOfCategoryDuringPeriodById(
          userInfo.fitbitId,
          "Walk",
          lastWeekInterval.start.toISODate(),
          lastWeekInterval.end.toISODate()
        );
      const filteredWalkList =
        FitbitStatisticsHelper.filterFitbitActivityListByDuration(
          walkActivityList,
          10 * 60
        );
      result.message = voca.replaceAll(
        result.message,
        "[7-day-walks-over-10mins]",
        filteredWalkList.length
      );
      result.surveyReplaced = true;
    }

    if (result.message.includes("[goal]")) {
      // set displayGoal to be userInfo.dailyStepGoal, if it is not set, set it to 5000
      const displayGoal =
        userInfo.dailyStepsGoal == undefined ? 5000 : userInfo.dailyStepsGoal;
      result.message = voca.replaceAll(
        result.message,
        "[goal]",
        `${displayGoal}`
      );
      result.surveyReplaced = true;
    }

    // this should be generalized, but will deal with it as a special case for now
    const matchList = StringHelper.matchSqureBracketPlaceholder(result.message);

    for (let i = 0; i < matchList.length; i++) {
      const match = matchList[i];
      // [response_surveyId_last]

      if (v.startsWith(match, "response", 1)) {
        // [response...]
        const trimmedString = v.trim(v.trim(match, "["), "]");

        const mSplit = trimmedString.split("|");

        // verion 2: with possibly multiple IDs, separated by :
        // Example: [response|SV_bBoOhje0dSNbZgq:SV_cACIS909SMXMUp8|last]
        const surveyIdListString = mSplit[1];
        const surveyIdList = surveyIdListString.split(":");
        let responseList = [];

        for (let j = 0; j < surveyIdList.length; j++) {
          const surveyId = surveyIdList[j];
          const oneResponseList =
            await SurveyResponseHelper.getSurveyResponseFromPersonDuringPeriod(
              surveyId,
              userInfo.username,
              DateTime.utc().minus({ years: 1 }),
              DateTime.utc(),
              1
            );
          if (oneResponseList.length > 0) {
            responseList.push(oneResponseList[0]);
          }
        }

        // now, need to sort the responses by their dateTime
        responseList.sort((responseA, responseB) => {
          const diffInSeconds = DateTimeHelper.diffDateTime(
            DateTime.fromJSDate(responseA.dateTime),
            DateTime.fromJSDate(responseB.dateTime),
            "seconds"
          ).toObject().seconds;
          return diffInSeconds;
        });

        // if there is, then only 1 is returend, otherwise, it would be empty
        // content
        let lastResponse = "";

        if (responseList.length > 0) {
          lastResponse = responseList[0]["content"];
        }
        result.message = voca.replaceAll(result.message, match, lastResponse);
        result.surveyReplaced = true;
      }

      // [survey_link_from_tasks|task_label_1:task_label_2|last]
      if (v.startsWith(match, "survey_link_from_tasks", 1)) {
        // [response...]
        const trimmedString = v.trim(v.trim(match, "["), "]");
        const mSplit = trimmedString.split("|");

        // verion 2: with possibly multiple IDs, separated by :
        // Example: [survey_link_from_tasks|SV_bBoOhje0dSNbZgq:SV_cACIS909SMXMUp8|last]
        const taskLabelListString = mSplit[1];
        const taskLabelList = taskLabelListString.split(":");
        let taskLogWithSurveyLinkList = [];

        // assuming "last" or the most recent

        for (let j = 0; j < taskLabelList.length; j++) {
          const taskLabel = taskLabelList[j];

          // find all taskLog with surveyLink
          const taskLogList =
            await TaskLogHelper.findTaskLogWithTaskLabelForPersonDuringPeriod(
              taskLabel,
              userInfo.username,
              DateTime.utc().minus({ years: 1 }),
              DateTime.utc(),
              0
            );

          // now, filter by whether there is an action?
          // randomizationResult.theChoice.action.surveyLink.length > 0
          const filteredTaskLogList = taskLogList.filter((taskLog) => {
            return (
              taskLog.randomizationResult.theChoice != undefined &&
              taskLog.randomizationResult.theChoice.action.surveyLink.length > 0
            );
          });

          if (filteredTaskLogList.length > 0) {
            taskLogWithSurveyLinkList.push(filteredTaskLogList[0]);
          }
        }

        // now, need to sort the responses by their dateTime
        taskLogWithSurveyLinkList.sort((itemA, itemB) => {
          const diffObject = DateTimeHelper.diffDateTime(
            DateTime.fromJSDate(itemA.dateTime),
            DateTime.fromJSDate(itemB.dateTime),
            "seconds"
          ).toObject();

          const diffInSeconds = diffObject.seconds;

          return diffInSeconds;
        });

        let lastSurveyLink = "";

        if (taskLogWithSurveyLinkList.length > 0) {
          // c.length > 0
          lastSurveyLink =
            taskLogWithSurveyLinkList[0].randomizationResult.theChoice.action
              .surveyLink;
        }

        const surveySeg = `${lastSurveyLink}?study_code=${userInfo.username}`;

        result.message = voca.replaceAll(result.message, match, surveySeg);

        result.surveyReplaced = true;
      }

      // [fitbit_wearing_days_since_join|wearingLowerBoundMinutes|max]
      if (v.startsWith(match, "fitbit_wearing_days_since_join", 1)) {
        // [response...]
        const trimmedString = v.trim(v.trim(match, "["), "]");

        const mSplit = trimmedString.split("|");
        const wearingLowerBoundMinutes = Number(mSplit[1]);
        const max = Number(mSplit[2]);
        const now = DateTime.now();

        const startDateTime =
          DateTimeHelper.generateStartOrEndDateTimeByReference(
            now,
            userInfo,
            {
              reference: "joinAtDate",
              offset: { value: { minutes: 0 }, type: "plus" },
            },
            "start"
          );

        const endDateTime =
          DateTimeHelper.generateStartOrEndDateTimeByReference(
            now,
            userInfo,
            {
              reference: "now",
              offset: { value: { minutes: 0 }, type: "plus" },
            },
            "end"
          );

        const minsList =
          await FitbitDataHelper.getUserFitbitWearingMinutesPerDayListDuringPeriod(
            userInfo.fitbitId,
            startDateTime,
            endDateTime
          );
        const resultList = minsList
          .map((x) => {
            return x >= wearingLowerBoundMinutes;
          })
          .filter((x) => x);

        result.message = voca.replaceAll(
          result.message,
          match,
          resultList.length > max ? max : resultList.length
        );

        result.surveyReplaced = true;
      }
    }

    return result;
  }
}
