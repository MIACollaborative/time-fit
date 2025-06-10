import voca from 'voca';
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

  static async replacePlaceholderFromMessage(message, userInfo, surveyLink){
    let result = {
        nameReplaced: false,
        surveyReplaced: false,
        message: message
    };

    if( result.message.includes("[PID]")){
        result.message = voca.replaceAll(result.message, '[PID]', userInfo.username); 
        result.nameReplaced = true;
    }

    if( result.message.includes("[name]")){
        result.message = voca.replaceAll(result.message, '[name]', userInfo.preferredName); 
        result.nameReplaced = true;
    }

    if( result.message.includes("<link>")){
        const surveySeg = `${surveyLink}?study_code=${userInfo.username}`;
        result.message = voca.replaceAll(result.message, '<link>', surveySeg); 
        result.surveyReplaced = true;
    }

    if( result.message.includes("[7-day-average-steps]")){
        const lastWeekInterval = DateTimeHelper.getLastWeekAsIntervalFromDateTime();

        
        
        let value = await DatabaseUtility.getUserFitbitAverageDailyStepsDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());
        let restrictedValue = value.toFixed(1);
        result.message = voca.replaceAll(result.message, '[7-day-average-steps]', restrictedValue); 
        result.surveyReplaced = true;
    }

    if( result.message.includes("[7-day-walks-over-10mins]")){
        console.log(`DatabaseUtility.replacePlaceholderFromMessage found [7-day-walks-over-10mins]`);
        const lastWeekInterval = DateTimeHelper.getLastWeekAsIntervalFromDateTime();
        
        let walkActivityList = await DatabaseUtility.getUserFitbitWalkActivityListDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());

        let filteredWalkList = GeneralUtility.filterFitbitWalkActivityListByDuration(walkActivityList, 10 * 60);

        result.message = voca.replaceAll(result.message, '[7-day-walks-over-10mins]', filteredWalkList.length); 
        result.surveyReplaced = true;
    }

    if( result.message.includes("[goal]")){
        console.log(`DatabaseUtility.replacePlaceholderFromMessage found [goal]`);
        // set displayGoal to be userInfo.dailyStepGoal, if it is not set, set it to 5000
        const displayGoal = userInfo.dailyStepsGoal == undefined? 5000: userInfo.dailyStepsGoal;
        result.message = voca.replaceAll(result.message, '[goal]', `${displayGoal}`); 
        result.surveyReplaced = true;
    }

    // move down to support parameters
    /*
    if( result.message.includes("[fitbit_wearing_days_since_join]")){
        console.log(`DatabaseUtility.replacePlaceholderFromMessage found [fitbit_wearing_days_since_join]`);
        let now = DateTime.now();

        let startDateTime = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, {reference: "joinAtDate", offset: {value: {minutes: 0}, type: "plus"}}, "start");

        let endDateTime = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, {reference: "now", offset: {value: {minutes: 0}, type: "plus"}}, "end");

        let minsList = await DatabaseUtility.getUserFitbitWearingMinutesPerDayListDuringPeriod(userInfo.fitbitId, startDateTime, endDateTime);
        let resultList = minsList.map(x => {return x >= wearingLowerBoundMinutes;});

        result.message = voca.replaceAll(result.message, '[fitbit_wearing_days_since_join]', resultList.length); 
        result.surveyReplaced = true;
    }
    */

    // this should be generalized, but will deal with it as a special case for now
    let matchList = GeneralUtility.matchSqureBracketPlaceholder(result.message);

    for(let i = 0; i < matchList.length; i++){
        let match = matchList[i];
        // [response_surveyId_last]

        if(v.startsWith(match, 'response', 1)){
            // [response...]
            let trimmedString = v.trim(v.trim(match, "["), "]");
            console.log(`trimmedString: ${trimmedString}`);

            let mSplit = trimmedString.split("|");

            // verion 2: with possibly multiple IDs, separated by :
            // Example: [response|SV_bBoOhje0dSNbZgq:SV_cACIS909SMXMUp8|last]
            let surveyIdListString = mSplit[1];
            let surveyIdList = surveyIdListString.split(":");
            let responseList = [];


            for(let j = 0; j < surveyIdList.length; j++){
                let surveyId = surveyIdList[j];

                // updated with user
                // findSurveyResponseFromPersonDuringPeriod
                let oneResponseList  = await DatabaseUtility.findSurveyResponseFromPersonDuringPeriod(surveyId, userInfo.username, DateTime.utc().minus({years: 1}), DateTime.utc(), 1);

                //let oneResponseList  = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, DateTime.now().minus({years: 1}), DateTime.utc(), 1);

                console.log(`oneResponseList for ${surveyId} length: ${oneResponseList.length}`);

                if(oneResponseList.length > 0){
                    console.log(`Adding one response for ${surveyId}`);
                    responseList.push(oneResponseList[0]);
                }
            }

            // now, need to sort the responses by their dateTime
            responseList.sort((responseA, responseB) => {
                let diffInSeconds =  GeneralUtility.diffDateTime(DateTime.fromJSDate(responseA.dateTime), DateTime.fromJSDate(responseB.dateTime), "seconds").toObject().seconds;

                console.log(`diffInSeconds: ${diffInSeconds}`);

                return diffInSeconds;
            });

            // if there is, then only 1 is returend, otherwise, it would be empty
            // content
            let lastResponse = "";

            if(responseList.length > 0){
                lastResponse = responseList[0]["content"];
            }

            console.log(`lastResponse: ${lastResponse}`);

            result.message = voca.replaceAll(result.message, match, lastResponse);

            result.surveyReplaced = true;


        }

        // [survey_link_from_tasks|task_label_1:task_label_2|last]
        if(v.startsWith(match, 'survey_link_from_tasks', 1)){
            // [response...]
            let trimmedString = v.trim(v.trim(match, "["), "]");
            console.log(`trimmedString: ${trimmedString}`);

            let mSplit = trimmedString.split("|");

            // verion 2: with possibly multiple IDs, separated by :
            // Example: [survey_link_from_tasks|SV_bBoOhje0dSNbZgq:SV_cACIS909SMXMUp8|last]
            let taskLabelListString = mSplit[1];
            let taskLabelList = taskLabelListString.split(":");
            let taskLogWithSurveyLinkList = [];

            // assuming "last" or the most recent


            for(let j = 0; j < taskLabelList.length; j++){
                let taskLabel = taskLabelList[j];

                // find all taskLog with surveyLink
                let taskLogList  = await DatabaseUtility.findTaskLogWithTaskLabelForPersonDuringPeriod(taskLabel, userInfo.username, DateTime.utc().minus({years: 1}), DateTime.utc(), 0);

                // now, filter by whether there is an action?
                // randomizationResult.theChoice.action.surveyLink.length > 0
                let filteredTaskLogList = taskLogList.filter((taskLog) => {
                    return taskLog.randomizationResult.theChoice != undefined && taskLog.randomizationResult.theChoice.action.surveyLink.length > 0;
                });

                if(filteredTaskLogList.length > 0){
                    console.log(`Adding one taskLog for ${taskLabel}`);
                    taskLogWithSurveyLinkList.push(filteredTaskLogList[0]);
                }
            }

            // now, need to sort the responses by their dateTime
            taskLogWithSurveyLinkList.sort((itemA, itemB) => {

                let diffObject = GeneralUtility.diffDateTime(DateTime.fromJSDate(itemA.dateTime), DateTime.fromJSDate(itemB.dateTime), "seconds").toObject();

                let diffInSeconds =  diffObject.seconds;

                console.log(`diffInSeconds: ${diffInSeconds}`);

                return diffInSeconds;
            });

            // version 1:with 1 and only 1 survey ID
            /*
            let surveyId = mSplit[1];

            // asssuming mSplit[2] == last for now

            let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, DateTime.now().minus({years: 1}), DateTime.utc(), 1);

            console.log(`responseList: ${responseList}`);
            */

            // if there is, then only 1 is returend, otherwise, it would be empty
            // content
            let lastSurveyLink = "";

            if(taskLogWithSurveyLinkList.length > 0){
                // c.length > 0
                lastSurveyLink = taskLogWithSurveyLinkList[0].randomizationResult.theChoice.action.surveyLink;
            }

            console.log(`lastSurveyLink: ${lastSurveyLink}`);

            let surveySeg = `${lastSurveyLink}?study_code=${userInfo.username}`;

            result.message = voca.replaceAll(result.message, match, surveySeg);

            result.surveyReplaced = true;

        }

        // [fitbit_wearing_days_since_join|wearingLowerBoundMinutes|max]
        if(v.startsWith(match, 'fitbit_wearing_days_since_join', 1)){
            // [response...]
            let trimmedString = v.trim(v.trim(match, "["), "]");
            console.log(`trimmedString: ${trimmedString}`);

            let mSplit = trimmedString.split("|");
            let wearingLowerBoundMinutes = Number(mSplit[1]);
            let max = Number(mSplit[2]);
            let now = DateTime.now();

            let startDateTime = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, {reference: "joinAtDate", offset: {value: {minutes: 0}, type: "plus"}}, "start");

            let endDateTime = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, {reference: "now", offset: {value: {minutes: 0}, type: "plus"}}, "end");

            let minsList = await DatabaseUtility.getUserFitbitWearingMinutesPerDayListDuringPeriod(userInfo.fitbitId, startDateTime, endDateTime);
            let resultList = minsList.map(x => {return x >= wearingLowerBoundMinutes;}).filter(x => x);

            console.log(`${this.name} replacePlaceholderFromMessage: startDateTime: ${startDateTime}`);
            console.log(`${this.name} replacePlaceholderFromMessage: endDateTime: ${endDateTime}`);
            console.log(`${this.name} replacePlaceholderFromMessage: minsList.length: ${minsList.length}`);
            console.log(`${this.name} replacePlaceholderFromMessage: minsList: ${minsList}`);
            console.log(`${this.name} replacePlaceholderFromMessage: resultList: ${resultList}`);


            result.message = voca.replaceAll(result.message, match, resultList.length > max? max: resultList.length);

            result.surveyReplaced = true;
        }
    }

    

    return result;
}
}
