import { DateTime, Interval } from "luxon";
import voca from 'voca';
import prisma from "./prisma.mjs";
import FitbitHelper from "./FitbitHelper.mjs";
import GeneralUtility from "./GeneralUtility.mjs";
import { inspect } from 'util';
import v from "voca";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class DatabaseUtility {

    constructor() {

    }
    static async insertFitbitUpdateList(updateList){
        console.log(`DatabaseUtility.insertFitbitUpdateList: ${updateList.length}`);
        const createResult = await prisma.fitbit_update.createMany({
            data: updateList
        });
        return createResult;
    }

    static async findMessageByLabel(mLabel){
        console.log(`DatabaseUtility.findMessageByLabel: ${mLabel}`);
        const message = await prisma.message.findFirst({
            where: { label: mLabel},
        });
        console.log(`DatabaseUtility.findMessageByLabel message: ${JSON.stringify(message)}`);
        //throw new Error('messasge does not exist');
        return message;
    }

    static async composeUserMessageForTwilio(userInfo, messageInfo, surveyURL=""){
        console.log(`${this.name} composeUserMessageForTwilio: userInfo: ${userInfo}, messageInfo: ${messageInfo}, surveyURL: ${surveyURL}`);
        let result = "";

        // To Do: need to handle template for preferredName and survey link later

        if(messageInfo["interventionMessage"] != undefined && messageInfo["interventionMessage"].length > 0){
            result += messageInfo["interventionMessage"] + " ";
        }

        if(messageInfo["walkMessage"] != undefined && messageInfo["walkMessage"].length > 0){
            result += messageInfo["walkMessage"] + " ";
        }

        // surveyType: "surveyLink", //surveyLabel or surveyLink
        // surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6EkGW2OdbOd7ltQ"

        /*
        if(messageInfo["surveyType"] != undefined && messageInfo["surveyType"].length > 0){
            if( messageInfo["surveyType"] == "surveyLink"){
                result += messageInfo["surveyLink"] + " ";
            }
        }
        */

        let placeholderReplaceResult = await DatabaseUtility.replacePlaceholderFromMessage(result, userInfo, surveyURL);

        result = placeholderReplaceResult.message;

        if(placeholderReplaceResult.surveyReplaced == false && surveyURL.length > 0){
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
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [PID]`);
            result.message = voca.replaceAll(result.message, '[PID]', userInfo.username); 
            result.nameReplaced = true;
        }

        if( result.message.includes("[name]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [name]`);
            result.message = voca.replaceAll(result.message, '[name]', userInfo.preferredName); 
            result.nameReplaced = true;
        }

        if( result.message.includes("<link>")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found <link>`);
            let surveySeg = `${surveyLink}?study_code=${userInfo.username}`;
            result.message = voca.replaceAll(result.message, '<link>', surveySeg); 
            result.surveyReplaced = true;
        }

        // [name], here is your weekly summary for this past week: You have walked [7-day-average-steps] steps on average each day, and went for a total of [7-day-walks-over-10mins] sustained walks for over 10 minutes this past week. Keep up the good work!

        if( result.message.includes("[7-day-average-steps]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [7-day-average-steps]`);
            let lastWeekInterval = GeneralUtility.getLastWeekAsInterval();
            
            let value = await DatabaseUtility.getUserFitbitAverageDailyStepsDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());
            let restrictedValue = value.toFixed(1);
            result.message = voca.replaceAll(result.message, '[7-day-average-steps]', restrictedValue); 
            result.surveyReplaced = true;
        }

        if( result.message.includes("[7-day-walks-over-10mins]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [7-day-walks-over-10mins]`);
            let lastWeekInterval = GeneralUtility.getLastWeekAsInterval();
            
            let walkActivityList = await DatabaseUtility.getUserFitbitWalkActivityListDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());

            let filteredWalkList = GeneralUtility.filterFitbitWalkActivityListByDuration(walkActivityList, 10 * 60);

            result.message = voca.replaceAll(result.message, '[7-day-walks-over-10mins]', filteredWalkList.length); 
            result.surveyReplaced = true;
        }

        if( result.message.includes("[goal]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [goal]`);


            let lastWeekInterval = GeneralUtility.getLastWeekAsInterval();
            
            let walkActivityList = await DatabaseUtility.getUserFitbitWalkActivityListDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());

            let filteredWalkList = GeneralUtility.filterFitbitWalkActivityListByDuration(walkActivityList, 10 * 60);

            result.message = voca.replaceAll(result.message, '[goal]', "7000 (default)"); 
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

                console.log(`responseList sort (desc): ${JSON.stringify(responseList, null, 2)}`);


                // version 1:with 1 and only 1 survey ID
                /*
                let surveyId = mSplit[1];

                // asssuming mSplit[2] == last for now

                let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, DateTime.now().minus({years: 1}), DateTime.utc(), 1);

                console.log(`responseList: ${responseList}`);
                */

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

                    //let oneResponseList  = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, DateTime.now().minus({years: 1}), DateTime.utc(), 1);

                    console.log(`taskLogList for ${taskLabel} length: ${taskLogList.length}`);

                    console.log(`taskLogList for ${taskLabel} length: ${JSON.stringify(taskLogList)}`);

                    // now, filter by whether there is an action?
                    // randomizationResult.theChoice.action.surveyLink.length > 0
                    let filteredTaskLogList = taskLogList.filter((taskLog) => {
                        return taskLog.randomizationResult.theChoice != undefined && taskLog.randomizationResult.theChoice.action.surveyLink.length > 0;
                    });

                    console.log(`filteredTaskLogList for ${taskLabel} length: ${JSON.stringify(filteredTaskLogList)}`);


                    if(filteredTaskLogList.length > 0){
                        console.log(`Adding one taskLog for ${taskLabel}`);
                        taskLogWithSurveyLinkList.push(filteredTaskLogList[0]);
                    }
                }

                // now, need to sort the responses by their dateTime
                taskLogWithSurveyLinkList.sort((itemA, itemB) => {

                    let diffObject = GeneralUtility.diffDateTime(DateTime.fromJSDate(itemA.dateTime), DateTime.fromJSDate(itemB.dateTime), "seconds").toObject();

                    console.log(`diffObject: ${JSON.stringify(diffObject)}`);

                    let diffInSeconds =  diffObject.seconds;

                    console.log(`diffInSeconds: ${diffInSeconds}`);

                    return diffInSeconds;
                });

                console.log(`taskLogWithSurveyLinkList sort (desc): ${JSON.stringify(taskLogWithSurveyLinkList, null, 2)}`);


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

    static async findMessageByGroup(gGroupName, avoidHistory=false, username=""){

        console.log(`DatabaseUtility.findMessageByGroup: ${gGroupName}, avoidHistory: ${avoidHistory}`);

        let messageList = [];



        if( avoidHistory ){
            messageList = (await DatabaseUtility.getUserMessageFromGroupWithLowestFrequency(username, gGroupName)).map((item) => {
                return item.info;
            });
        }
        else{
            messageList = await prisma.message.findMany({
                where: { group: gGroupName},
                orderBy: [
                    {
                      groupIndex: 'asc',
                    }
                  ],
            });
        }

        console.log(`DatabaseUtility.findMessageByGroup messageList.length: ${messageList.length}`);
        // now, how do I record the history and avoid it?

        let randomIndex = Math.floor(messageList.length * Math.random());

        console.log(`DatabaseUtility.findMessageByGroup randomIndex: ${randomIndex}`);
        



        let pickedMessage = messageList[randomIndex];

        //console.log(`DatabaseUtility.findMessageByGroup pickedMessage: ${JSON.stringify(pickedMessage)}`);



        // To Do: support avoidHistory



        return pickedMessage;
    }

    static async getUserMessageFromGroupWithLowestFrequency(username, groupName){
        //let resultList = [];

        let frequencyDict = await DatabaseUtility.getUserMessageFromGroupCountDict(username, groupName);

        //console.log(`getUserMessageFromGroupWithLowestFrequency.frequencyDict: ${JSON.stringify(frequencyDict)}`);

        let frequencyList = Object.keys(frequencyDict).map((messageLabel) => {
            return {
                label: messageLabel,
                info: frequencyDict[messageLabel].info,
                frequency: frequencyDict[messageLabel].count
            };
        });

        //console.log(`frequencyList: ${JSON.stringify(frequencyList)}`);

        frequencyList.sort((a, b) => {
            return a.frequency - b.frequency;
        });

        let lowestFrequency = frequencyList[0].frequency;

        let lowFrequencyList = frequencyList.filter((item) => {
            return item.frequency == lowestFrequency;
        });


        return lowFrequencyList;
    }

    static async getUserMessageFromGroupCountDict(username, groupName){
        const groupMessages = await prisma.message.findMany({
            where: {
                group: {
                    equals: groupName,
                },
            },
        });

        console.log(`getUserMessageFromGroupCountDict`);
        //console.log(`getUserMessageFromGroupCountDict.groupMessages:${JSON.stringify(groupMessages)}`);

        let messageLabelList = groupMessages.map((messageInfo) => {return messageInfo.label;});

        let userMessageCountDict = await DatabaseUtility.getCurrentUserMessageCountDict(username);
        let resultDict = {};

        //console.log(`getUserMessageFromGroupCountDict.userMessageCountDict:${JSON.stringify(userMessageCountDict)}`);

        groupMessages.forEach((messageInfo) => {
            let messageLabel = messageInfo["label"];

            if(userMessageCountDict[messageLabel] != undefined){
                resultDict[messageLabel] = {
                    info: messageInfo,
                    count: userMessageCountDict[messageLabel]
                };
            }
            else{
                resultDict[messageLabel] = {
                    info: messageInfo,
                    count: 0
                };
            }


        })

        //console.log(`resultDict: ${JSON.stringify(resultDict)}`);

        return resultDict;
    }

    static async getCurrentUserMessageCountDict(username){
        console.log(`getCurrentUserMessageCountDict username: ${username}`);

        const results = await prisma.taskLog.groupBy({
            by: ['messageLabel'],
            where: {
                username: {
                    equals: username,
                },
            },
            _count: {
                messageLabel: true,
            },
        });
        
        
        let resultList = JSON.parse(JSON.stringify(results, replacer));
    
        //console.log(`getCurrentUserMessageCountDict resultList: ${JSON.stringify(resultList, null, 2)}`);
    
    
        let resultDict = {};
    
        resultList.forEach((result) => {
    
            /*()
            {
                "_count": {
                  "messageLabel": 1
                },
                "messageLabel": "nongif-m_23"
              }
            */
    
            if (result["messageLabel"] != null){
                resultDict[result["messageLabel"]] = result["_count"]["messageLabel"];
            }
        });
    
        return resultDict;
    }

    static async getUserFitbitWalkActivityListDuringPeriodById(fitbitId, startDateString, endDateString){

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}`);


        let recordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString);

        let activityList = [];



        recordList.forEach((record) => {
            if(record.content.activities.length > 0){
                activityList = activityList.concat(record.content.activities);
            }
        });

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById activityList: ${activityList}`);

        let walkActivityList = activityList.filter((item) => {
            return item.activityParentName == "Walk";
        });

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById walkActivityList: ${JSON.stringify(walkActivityList)}`);

        return walkActivityList;
    }

    static async getUserFitbitAverageDailyStepsDuringPeriodById(fitbitId, startDateString, endDateString){
        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}`);


        let averageSteps = 0;

        let recordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString);

        let stepsList = recordList.map((record) => {
            if(record.content.summary != undefined){
                return record.content.summary.steps;
            }
            else{

                console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById recoord (no content summary): ${JSON.stringify(record, null, 2)}`);
                return 0;
            }
            
        });

        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById stepsList: ${stepsList}`);

        let sum = stepsList.reduce((partialSum, a) => partialSum + a, 0);

        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById sum: ${sum}`);

        averageSteps = stepsList.length > 0 ? sum/stepsList.length: 0;

        return averageSteps;
    }


    static async getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString){

        let recordList = await prisma.fitbit_data.findMany({
            where:{
                ownerId: fitbitId,
                dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
                dateTime: {
                    gte: startDateString,
                    lte: endDateString
                }
            }
        });

        return recordList;
    }

    static async getUserFitbitUpdateDuringPeriodByIdAndOwnerType(fitbitId, startDateTime, endDateTime, ownerType="user", collectionType="activities"){

        let recordList = await prisma.fitbit_update.findMany({
            where:{
                ownerId: fitbitId,
                ownerType: ownerType,
                collectionType: collectionType,
                createdAt: {
                    gte: startDateTime.toISO(),
                    lte: endDateTime.toISO()
                }
            },
            //take: limit,
            //orderBy: orderList
        });

        return recordList;
    }

    static async getTaskLogWithErrorDuringPeriod(startDateTime, endDateTime){

        let recordList = await prisma.taskLog.findMany({
            where:{
                createdAt: {
                    gte: startDateTime.toISO(),
                    lte: endDateTime.toISO()
                }
            },
            //take: limit,
            //orderBy: orderList
        });

        recordList = recordList.filter((taskLog) =>{
            return taskLog.executionResult["value"] != undefined && taskLog.executionResult.value.status == "failed";
        });
        

        return recordList;
    }

    static async getUserFitbitDateAndWearingMinutesListDuringPeriod(fitbitId, startDateTime, endDateTime){
        console.log(`${this.name} getUserFitbitDateAndWearingMinutesListDuringPeriod, fitbitId: ${fitbitId}, start: ${startDateTime}, end: ${endDateTime}`);
        let resultList = [];
        let minsList = [];

        let curDateTime = startDateTime;

        while( GeneralUtility.diffDateTime(curDateTime, endDateTime, "seconds").toObject().seconds >= 0){
            let aggregatedMinutes = await DatabaseUtility.getUserFitbitHeartRateIntradayMinutesByIdAndDate(fitbitId, curDateTime);

            console.log(`[${curDateTime}]: minutes: ${aggregatedMinutes}`);

            resultList.push({
                dateTime: curDateTime.toFormat('yyyy-MM-dd'),
                wearingMinutes: aggregatedMinutes,
            })
            // update curDate
            curDateTime = GeneralUtility.operateDateTime(curDateTime, {"days": 1}, "plus");
        }

        console.log(`${this.name} getUserFitbitDateAndWearingMinutesListDuringPeriod minsList: ${resultList}`);

        return resultList;
    }

    static async getUserFitbitWearingMinutesPerDayListDuringPeriod(fitbitId, startDateTime, endDateTime){
        console.log(`${this.name} getUserFitbitWearingMinutesPerDayListDuringPeriod, fitbitId: ${fitbitId}, start: ${startDateTime}, end: ${endDateTime}`);
        let resultList = [];
        let minsList = [];

        let curDateTime = startDateTime;

        while( GeneralUtility.diffDateTime(curDateTime, endDateTime, "seconds").toObject().seconds >= 0){
            let aggregatedMinutes = await DatabaseUtility.getUserFitbitHeartRateIntradayMinutesByIdAndDate(fitbitId, curDateTime);

            console.log(`[${curDateTime}]: minutes: ${aggregatedMinutes}`);

            minsList.push(aggregatedMinutes);
            //resultList.push(aggregatedMinutes >= wearingLowerBoundMinutes);

            // update curDate
            curDateTime = GeneralUtility.operateDateTime(curDateTime, {"days": 1}, "plus");
        }

        

        console.log(`${this.name} getUserFitbitWearingDaysDuringPeriod minsList: ${minsList}`);
        //console.log(`${this.name} getUserFitbitWearingDaysDuringPeriod resultList: ${resultList}`);

        return minsList;

        /*
        let result = resultList.filter(x => x).length;

        return result;

        if( wearingDayLowerBoundCount == undefined){
            // require all days in range
            result = GeneralUtility.reduceBooleanArray(resultList, resultAggregator);
        }
        else {
            // having wearingDayLowerBoundCount will ignore resultAggregator 
            result = resultList.filter(x => x).length >= wearingDayLowerBoundCount; // GeneralUtility.reduceBooleanArray(resultList, resultAggregator);
        }
        */
    }

    static async getUserFitbitHeartRateIntradayMinutesByIdAndDate(fitbitId, startDateTime){
        console.log(`${this.name} getUserFitbitHeartRateIntradayMinutesByIdAndDate, fitbitId: ${fitbitId}, dateTime: ${startDateTime}`);

        // get the time string
        let timeString = startDateTime.toFormat('yyyy-MM-dd');

        let record = await prisma.fitbit_data.findFirst({
            where:{
                ownerId: fitbitId,
                dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_HEART,
                dateTime: timeString,
            },
            //take: limit,
            //orderBy: orderList
        });

        //console.log(`${this.name} getUserFitbitHeartRateIntradayMinutesByIdAndDate, record: ${JSON.stringify(record)}`);

        let minutesTotal = 0;

        if(record != undefined){
            // version 2: use intraday
            let heartRateDataSet = record["content"]["activities-heart-intraday"]["dataset"];
            minutesTotal += heartRateDataSet.length;

            // version 1: use minutes of different types
            /*
            let heartRateZonesList = record["content"]["activities-heart"][0]["value"]["heartRateZones"];
            heartRateZonesList.forEach((zoneInfo) => {
                minutesTotal += zoneInfo["minutes"];
            });
            */
        }

        return minutesTotal;
        
        /*
        {
            "dateTime": "2022-08-30",
            "value": {
              "customHeartRateZones": [],
              "heartRateZones": [
                {
                  "caloriesOut": 1056.324,
                  "max": 91,
                  "min": 30,
                  "minutes": 585,
                  "name": "Out of Range"
                },
                {
                  "caloriesOut": 723.90912,
                  "max": 127,
                  "min": 91,
                  "minutes": 161,
                  "name": "Fat Burn"
                },
                {
                  "caloriesOut": 120.15296,
                  "max": 154,
                  "min": 127,
                  "minutes": 11,
                  "name": "Cardio"
                },
                {
                  "caloriesOut": 13.46112,
                  "max": 220,
                  "min": 154,
                  "minutes": 1,
                  "name": "Peak"
                }
              ],
              "restingHeartRate": 72
            }
          }
          */


        
    }

    static async getUserFitbitDailyGoalsForWearingDaysDuringPeriodById(fitbitId, startDateString, endDateString, goalType, wearingLowerBoundMinutes, recentLimit){
        console.log(`${this.name} getUserFitbitDailyGoalsForWearingDaysDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}, goalType: ${goalType}, wearingLowerBoundMinutes: ${wearingLowerBoundMinutes}, recentLimit: ${recentLimit}`);

        const dateGoalList = await DatabaseUtility.getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById(fitbitId, "2024-11-27", "2024-12-02", "steps");


        const wearingDateGoalList = dateGoalList.filter((dateGoal) => {
            return dateGoal.wearingMinutes >= wearingLowerBoundMinutes;
        });

        // get the last three elements of the list
        const recentWearingDateGoalList = wearingDateGoalList.slice(-recentLimit);


        console.log(`${this.name} getUserFitbitDailyGoalsForWearingDaysDuringPeriodById recentWearingDateGoalList: ${recentWearingDateGoalList}`);

        return dateGoalList;
    }

    static async getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById(fitbitId, startDateString, endDateString, goalType){
        console.log(`${this.name} getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}, goalType: ${goalType}`);

        let dateGoalList = [];

        //const wearingLowerBoundMinutes = 60 * 8;


        // This is activity-summary, with goals
        let recordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString);

        let startDate = DateTime.fromISO(startDateString);
        let endDate = DateTime.fromISO(endDateString);

        const dateAndMinsList = await DatabaseUtility.getUserFitbitDateAndWearingMinutesListDuringPeriod(fitbitId, startDate, endDate);

        // print the length of both lists
        console.log(`${this.name} getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById recordList.length: ${recordList.length}, dateAndMinsList.length: ${dateAndMinsList.length}`);

        // now, start from the ending, find days actual records
        for(let i = dateAndMinsList.length - 1; i >= 0; i--){
            let dateAndGoal = {};
            const dateMins = dateAndMinsList[i];

            let record = undefined;

            for(let j = recordList.length - 1; j >= 0; j--){
                if(recordList[j].dateTime == dateMins.dateTime){
                    record = recordList[j];
                    break;
                }
            }

            if(record == undefined){
                dateAndGoal =  {
                    dateTime: dateMins.dateTime,
                    goal: 0,
                    wearingMinutes: dateMins.wearingMinutes
                };
            }
            else{
                dateAndGoal =  {
                    dateTime: dateMins.dateTime,
                    goal: record.content.goals[goalType],
                    wearingMinutes: dateMins.wearingMinutes
                };
            }

            console.log(`record: ${JSON.stringify(record, null, 2)}`);
            
            dateGoalList.push(dateAndGoal);
        }

        console.log(`${this.name} getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById dateGoalList: ${dateGoalList}`);

        return dateGoalList;
    }

    static async getUsersWithLessThanCertainSubscritions(threshold=2){

        let userList = await prisma.users.findMany({
            include: {
                fitbitSubscriptionList: true
            },
        })
        
        userList = userList.filter((userInfo) => {
            console.log(`user[${userInfo.username}] fitbitSubscriptionList.length: ${userInfo.fitbitSubscriptionList.length}`);
            return userInfo.fitbitSubscriptionList.length < threshold;
        });

        return userList;
    }

    static async getFitbitUpdateByStatusWithLimit(status="notification", limit=50, prioritizeSystemUpdate=true, favorRecent=true){
        console.log(`${this.name} getFitbitUpdateByStatusWithLimit: ${status}, limit=${limit}`);
        // version 2: proritize system update
        let updateList;
        let orderList = [
            {
                createdAt: favorRecent? 'desc': 'asc',
            },
        ];
        
        if( prioritizeSystemUpdate ){
            // sort by ownerType first
            orderList.unshift({
                ownerType: 'desc',
            });
        }

        let queryObj = {
            where:{
                status: status
            },
            orderBy: orderList
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        console.log(`${this.name} getFitbitUpdateByStatusWithLimit: orderList=${orderList}`);

        updateList = await prisma.fitbit_update.findMany(queryObj);

        return updateList;
    }

    static async isSurveyCompletedByPerson(surveyId, personId){
        console.log(`${this.name }.isSurveyCompletedByPerson: ${surveyId} by ${personId}`);

        let startDate = DateTime.utc(2000);
        let endDate = DateTime.utc();

        let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, startDate, endDate, 0);
        

        responseList = responseList.filter((responseInfo) => {
            
            return responseInfo.participantId == personId;
        });

        return responseList.length > 0;
    }

    static async isSurveyCompleted(surveyId){
        console.log(`${this.name }.isSurveyCompleted: ${surveyId}`);

        let startDate = DateTime.utc(2000);
        let endDate = DateTime.utc();

        let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, startDate, endDate, 1);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return responseList.length > 0;
    }

    static async findTaskLogWithActionTypeDuringPeriod(actionType, startDateTime, endDateTime, limit=0){
        console.log(`${this.name }.findTaskLogWithActionTypeDuringPeriod: ${startDateTime}, ${endDateTime}`);

        let queryObj = {
            where: {
                createdAt: {
                    gte: startDateTime.toISO(),
                    lte: endDateTime.toISO()
                }
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let itemList = await prisma.taskLog.findMany(queryObj);


        itemList = itemList.filter((itemInfo) => {
            
            return itemInfo["randomizationResult"]["theChoice"] != undefined && itemInfo["randomizationResult"]["theChoice"]["action"]["type"] == actionType;
        });

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return itemList;
    }

    static async findTaskLogWithTaskLabelDuringPeriod(taskLabel, startDateTime, endDateTime, limit=0){
        console.log(`${this.name }.findTaskLogDuringPeriod: ${startDateTime}, ${endDateTime}`);

        let queryObj = {
            where: {
                taskLabel: taskLabel,
                createdAt: {
                    gte: startDateTime.toISO(),
                    lte: endDateTime.toISO()
                }
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let itemList = await prisma.taskLog.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return itemList;
    }

    static async findTaskLogWithTaskLabelForPersonDuringPeriod(taskLabel, personId, startDateTime, endDateTime, limit=0){
        console.log(`${this.name }.findTaskLogWithTaskLabelForPersonDuringPeriod: ${taskLabel}, ${personId}, ${startDateTime}, ${endDateTime}`);

        let queryObj = {
            where: {
                taskLabel: taskLabel,
                username: personId,
                createdAt: {
                    gte: startDateTime.toISO(),
                    lte: endDateTime.toISO()
                }
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let itemList = await prisma.taskLog.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return itemList;
    }

    static async findTaskLogWithMessageLabelDuringPeriod(messageLabel, startDate, endDate, limit=0){
        console.log(`${this.name }.findTaskLogDuringPeriod: ${startDate}, ${endDate}`);

        let queryObj = {
            where: {
                messageLabel: messageLabel,
                createdAt: {
                    gte: startDate.toISO(),
                    lte: endDate.toISO()
                }
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let itemList = await prisma.taskLog.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return itemList;
    }

    static async findTaskLogDuringPeriod(startDate, endDate, limit=0){
        console.log(`${this.name }.findTaskLogDuringPeriod: ${startDate}, ${endDate}`);

        let queryObj = {
            where: {
                createdAt: {
                    gte: startDate.toISO(),
                    lte: endDate.toISO()
                }
            },
            orderBy: [
                {
                    createdAt: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let itemList = await prisma.taskLog.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return itemList;
    }

    static async findSurveyResponseFromPersonDuringPeriod(surveyId, participantId, startDate, endDate, limit=0){
        console.log(`${this.name }.findSurveyResponseFromPersonDuringPeriod: ${surveyId}, ${participantId}, ${startDate.toISO()}, ${endDate.toISO()}`);

        let queryObj = {
            where: {
                surveyId: surveyId,
                participantId: participantId,
                dateTime: {
                    gte: startDate.toISO(),
                    lte: endDate.toISO()
                }
            },
            orderBy: [
                {
                    dateTime: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let responseList = await prisma.response.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return responseList;
    }


    static async findSurveyResponseDuringPeriod(surveyId, startDate, endDate, limit=0){
        console.log(`${this.name }.findSurveyResponoseDuringPeriod: ${surveyId}, ${startDate}, ${endDate}`);

        let queryObj = {
            where: {
                surveyId: surveyId,
                dateTime: {
                    gte: startDate.toISO(),
                    lte: endDate.toISO()
                }
            },
            orderBy: [
                {
                    dateTime: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let responseList = await prisma.response.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return responseList;
    }



    static async updateToken(hashCode, accessToken, refreshToken, userInfo=null) {
        console.log(`updateToken, hashCode: ${hashCode}`);
        console.log(`updateToken, accessToken: ${accessToken}`);
        console.log(`updateToken, refreshToken: ${refreshToken}`);

        let theUser;

        if(userInfo == null){
            theUser = await prisma.users.findFirst({
                where: { hash: hashCode },
            });
        }
        else{
            theUser = userInfo;
        }

        console.log(`theUser: ${JSON.stringify(theUser)}`);
    
        const updatedUser = await prisma.users.update({
            where: { username: theUser.username },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    
        console.log(`updatedUser: ${JSON.stringify(updatedUser)}`);

        return updatedUser;
    }

    static async refreshAndUpdateTokenForUser(userInfo){
        console.log(`${this.name}.refreshAndUpdateTokenForUser: userInfo: ${userInfo.username}`);
        let newAccessToken;
        let newRefreshToken;

        const refreshResult = await FitbitHelper.refreshToken(userInfo.refreshToken)
        .then((responseData) => {
            console.log(
                `responseData: ${JSON.stringify(
                    responseData
                )}`
            );

            /*
            if(responseData.status == 400){
                // cannot auth: Bad Request
                // I supposed this mean we need to authenticate again
            }
            */


            /*
            {
              "access_token": "eyJhbGciOiJIUzI1...",
              "expires_in": 28800,
              "refresh_token": "c643a63c072f0f05478e9d18b991db80ef6061e...",
              "token_type": "Bearer",
              "user_id": "GGNJL9"
            }
            */

            newAccessToken = responseData.access_token;

            // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
            newRefreshToken = responseData.refresh_token;

            // To Do: ideally, store both
            //updateToken(user.hash, newAccessToken, newRefreshToken);

            return { type: "response", result: {...userInfo, accessToken: newAccessToken, refreshToken: newRefreshToken} };
            //return { value: "success", data: responseData };

            //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);

                console.log(`Error response`);
                // which means, authentication falil
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);

                console.log(`Error request`);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);

                console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            return { type: "error", result: inspect(error.response.data) };
        });

        if(refreshResult.type == "response"){
            // need to actually update the token
            let updatedUserInfo = await DatabaseUtility.updateToken(userInfo.hash, newAccessToken, newRefreshToken, userInfo);

            return {value: "success", data: updatedUserInfo};
        }
        else{
            return {value: "failsed", data: refreshResult};
        }
    }

    static async ensureTokenValidForUser(userInfo, autoRefresh=false, minValidthresholdInSeconds=8 * 60 * 60){

        // version 1
        //let introspectResult = await FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);

        // version 2: myIntrospectToken
        /*
        return {type: "response", result: responseData};
        return {type: "error", result: error};
        */
        let introspectResult = undefined;
        console.log(`${this.name}.ensureTokenValidForUser: userInfo.accessToken: ${userInfo.accessToken}`);

        let myIntrospectResult = await FitbitHelper.myIntrospectToken(userInfo.accessToken, userInfo.accessToken);

        console.log(`${this.name}.ensureTokenValidForUser: myIntrospect result: ${JSON.stringify(myIntrospectResult, null, 2)}`);

        if(myIntrospectResult.type == "response"){
            introspectResult = myIntrospectResult.result;
        }
        else{
            // unhandledRejection: Error: Request failed with status code 401
            // need to refresh then
        }

        console.log(`${this.name}.ensureTokenValidForUser: introspect result: ${JSON.stringify(introspectResult, null, 2)}`);
        
        
        
        if (introspectResult != undefined && introspectResult.active == true){
            let expiredDate = DateTime.fromMillis(introspectResult["exp"]);
            let nowDate = DateTime.now();

            let diffInSeconds = expiredDate.diff(nowDate, 'seconds').toObject()["seconds"];
            console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}], threshold: [${minValidthresholdInSeconds}]`);



            // token is still valid
            if(autoRefresh == false){
                console.log(`${this.name}.ensureTokenValidForUser: autoRefresh: ${autoRefresh}`);
                return { value: "success", data: userInfo };
            }
            else {
                if(diffInSeconds > minValidthresholdInSeconds){
                    console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}] greater than the threshold: [${minValidthresholdInSeconds}] -> don't force refresh`);
                    return { value: "success", data: userInfo };
                }
                else{
                    console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}] less than the threshold: [${minValidthresholdInSeconds}] -> force refresh`);
                }
            }
        }

        // accessToken is not valid
        // or, diffInSeconds is small than the minimum tolerable threshold (too close to the expire time)
        const refreshResult = await FitbitHelper.refreshToken(userInfo.refreshToken)
        .then((responseData) => {
            console.log(
                `${this.name}.refreshToken: ${JSON.stringify(
                    responseData
                )}`
            );

            /*
            if(responseData.status == 400){
                // cannot auth: Bad Request
                // I supposed this mean we need to authenticate again
            }
            */


            /*
            {
              "access_token": "eyJhbGciOiJIUzI1...",
              "expires_in": 28800,
              "refresh_token": "c643a63c072f0f05478e9d18b991db80ef6061e...",
              "token_type": "Bearer",
              "user_id": "GGNJL9"
            }
            */

            let newAccessToken = responseData.access_token;

            // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
            let newRefreshToken = responseData.refresh_token;



            return { value: "success", data: {...userInfo, accessToken: newAccessToken, refreshToken: newRefreshToken} };

            //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);

                console.log(`Error response`);
                // which means, authentication falil
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);

                console.log(`Error request`);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);

                console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            return { value: "failed", data: inspect(error.response.data) };
        });

        if(refreshResult.value == "success"){
            // need to actually update the token
            let updatedUserInfo = await DatabaseUtility.updateToken(userInfo.hash, refreshResult.data.accessToken, refreshResult.data.refreshToken, userInfo);

            return {value: "success", data: updatedUserInfo};
        }

        

        return refreshResult;
    }

    static async countSubscription(){
        const subCount = await prisma.fitbit_subscription.count();

        return subCount;
    }

    static async updateFitbitUpdateStatusWithSameSignatureBeforeTime(fUpdate, oldStatus="notification", newStatus="processed", timestamp){

        console.log(`${this.name}: updateOlderFitbitUpdateWithSameSignature: ${JSON.stringify(fUpdate, null, 2)}`);

        const updateOlderList = await prisma.fitbit_update.updateMany({
            where: {
                status: oldStatus,
                ownerId: fUpdate.ownerId,
                collectionType: fUpdate.collectionType,
                date: fUpdate.date,
                createdAt: {
                    lte: timestamp //fUpdate.createdAt
                },
            },
            data: {
                status: newStatus,
            },
        });

        return updateOlderList;
    }

    static async updateUserInfo(userInfo, propertyValueObject){

        console.log(`${this.name}: updateUserInfo ${userInfo.username}:  ${JSON.stringify(propertyValueObject, null, 2)}`);

        const updateResult = await prisma.users.update({
            where: {
                username: userInfo.username,
            },
            data: {
                ...propertyValueObject
            },
        });

        return updateResult;
    }

    static async createSubscriptionsForUser(userInfo, collectionTypeList=["activities", "userRevokedAccess"]){
        console.log(`${this.name}.createSubscriptionsForUser: ${JSON.stringify(userInfo)}`);
        let resultList = [];

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return resultList;
        }

        for(let i = 0; i < collectionTypeList.length; i++){
            let cType = collectionTypeList[i];
            console.log(`DatabaseUtility.createSubscriptionsForUser: collection: ${cType}`);
            // now, need to determine the subscriptionId
            // count the number of subscription and increase by 1


            // An optional identifier to refer to this subscriber. If none specified, we assign one for you (starting with 1,2,3...) Subscriber IDs may be up to 50 unicode characters long. Fitbit encourages you to choose an ID that makes the most sense to you.

            // version 2: just id and type
            let newSubscriptionId = `${updatedUserInfo.fitbitId}-${cType}`;

            // version 1: with index
            /*
            let currentSubCount = await DatabaseUtility.countSubscription();
            let newSubscriptionId = `${updatedUserInfo.fitbitId}-${cType}-${currentSubCount + 1}`;
            */

            // now, create subscription
            // example result
            /*
            {
                "collectionType":"activities",
                "ownerId":"GGNJL9",
                "ownerType":"user",
                "subscriberId":"1",
                "subscriptionId":"320"
            }
            */

            let subscriptionResult = await FitbitHelper.createSubscriptionForFitbitId(updatedUserInfo.fitbitId, cType, newSubscriptionId, updatedUserInfo.accessToken);

            let {subscriptionId, ...rest} = subscriptionResult;

            // version 2: upsert
            await prisma.fitbit_subscription.upsert({
                where: {
                    subscriptionId: subscriptionResult['subscriptionId'],
                },
                update: {...rest},
                create: subscriptionResult,
              })

            // version 1: create
            /*
            await prisma.fitbit_subscription.create({
                data: subscriptionResult
            });
            */

            resultList.push(subscriptionResult);

            console.log(`DatabaseUtility.createSubscriptionsForUser: subscriptionResult: ${JSON.stringify(subscriptionResult)}`);
        }

        return resultList;
    }

    static async listSubscriptionsForUser(userInfo, collectionTypeList=["activities", "userRevokedAccess"]){
        console.log(`${this.name}.listSubscriptionsForUser: ${JSON.stringify(userInfo)}`);
        let resultList = [];

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return resultList;
        }

        for(let i = 0; i < collectionTypeList.length; i++){
            let cType = collectionTypeList[i];
            console.log(`DatabaseUtility.createSubscriptionsForUser: collection: ${cType}`);
            // now, need to determine the subscriptionId
            // count the number of subscription and increase by 1


            // An optional identifier to refer to this subscriber. If none specified, we assign one for you (starting with 1,2,3...) Subscriber IDs may be up to 50 unicode characters long. Fitbit encourages you to choose an ID that makes the most sense to you.

            let subscriptionResult = await FitbitHelper.listSubscriptionForFitbitId(updatedUserInfo.fitbitId, cType, updatedUserInfo.accessToken);

            resultList.push(subscriptionResult);

            console.log(`DatabaseUtility.createSubscriptionsForUser: subscriptionResult: ${JSON.stringify(subscriptionResult)}`);
        }

        return resultList;
    }

    static async isFitbitUpdateDateWithinAppropriateScope(fitbitUpdate){
        console.log(`${this.name}.isFitbitUpdateDateWithinAppropriateScope: ${JSON.stringify(fitbitUpdate)}`);

        let result = false;

        // get the user first
        let aUser = await prisma.users.findFirst({
            where: {
                fitbitId: fitbitUpdate.ownerId
            }
        });

        if( aUser == undefined){
            return false;
        }

        let userInfo = JSON.parse(JSON.stringify(aUser, replacer));

        console.log(`${this.name}.isFitbitUpdateDateWithinAppropriateScope user: [${userInfo.username}]--------------`);
        console.log(`${this.name}.isFitbitUpdateDateWithinAppropriateScope timezone: [${userInfo.timezone}]--------------`);


        // version 2

        // version 1
        let dateString = fitbitUpdate.date;
        let targetDate = DateTime.fromISO(dateString, {zone: userInfo.timezone} );

        //let targetDate = GeneralUtility.getLocalTime(DateTime.fromISO(dateString), userInfo.timezone);

        console.log(`${this.name}.isFitbitUpdateDateWithinAppropriateScope targetDate: [${targetDate}]--------------`);


        // now, what is the logic
        // an update is eligible if
        // it is after a person join
        // it is before a person complete

        let now = DateTime.now();

        let startTimeSpec = userInfo["joinAt"] != undefined? {
            reference: "joinAtDate",
            offset: { type: "plus", value: { hours: 0 } }
        }: undefined;

        if(startTimeSpec == undefined){
            // if you have not join the study for that date, this Fitbit update should be not processed.
            result = false;
            return result;
        }

        let endTimeSpec = userInfo["completeAt"] != undefined? {
            reference:  "completeAtDate",
            offset: { type: "plus", value: { hours: 0 } }
        }: undefined;
        
        let startDate = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, startTimeSpec, "start");
        
        let endDate = GeneralUtility.generateStartOrEndDateTimeByReference(now, userInfo, endTimeSpec, "end");
        //endDate = endDate.plus({ "milliseconds": 1 });

        // now construct an interval to check
        // result
        let validInterval = Interval.fromDateTimes(startDate, endDate);

        console.log(`eligible interval: ${validInterval}`);

        result = validInterval.contains(targetDate);

        // return result

        return result;
    }

    static async queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, insertToDB=true, numOfDays=1, suppressTokenValidation=false){
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: ${userInfo.username}, ${targetDate}, numOfDays: ${numOfDays}`);

        // .toISODate() -> what will be used by FitbitHelper
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: targetDate.toISODate:, ${targetDate.toISODate()}`);


        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };

        let updatedUserInfo = userInfo;

        if( !suppressTokenValidation ){
            let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
            console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: token validation: ${validateTokenResult.value}`);
    
    
            if(validateTokenResult.value == "success"){
                updatedUserInfo = validateTokenResult.data;
            }
            else{
                // cannot update userInfo, need to abort
                return validateTokenResult;
            }
        }


        // use updatedUserInfo from this point

        let resultList = [];
        // now query the data
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDate.plus({"days": i});

            let activityResult = await FitbitHelper.getActvitySummaryAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, curDate)
            .then((responseData) => {
              console.log(
                `FitbitHelper.getActvitySummaryAtDateForFitbitId: ${JSON.stringify(
                  responseData
                )}`
              );
        
              /*
              if(responseData.status == 400){
                  // cannot auth: Bad Request
                  // I supposed this mean we need to authenticate again
              }
              */
        
              //accessToken = responseData.access_token;
        
              // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
              //refreshToken = responseData.refresh_token;
        
              // To Do: ideally, store both
              //updateToken(hashCode, accessToken, refreshToken);
        
              return {value: "success", data: responseData};
        
              //res.status(200).json({ message: "authentication success" });
            })
            .catch((error) => {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);
        
                console.log(`Error response`);
                // which means, authentication falil
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
        
                console.log(`Error request`);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
        
                console.log("Error else");
              }
              //res.status(error.response.status).json({ response: inspect(error.response.data) });
        
              let resultObj = eval(`(${inspect(error.response.data)})`);
              return {value: "failed", data: resultObj};
            });
    
            console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser [${curDate.toFormat('yyyy-MM-dd')}]: query result: ${activityResult.value}`);
    
    
            if(insertToDB == true && activityResult.value == "success"){
                resultData = activityResult.data;
    
                // now insert the data
                // To Do: decide the schema
                let dataType = GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY;
    
                // targetDate.toISODate()
                let dateTime =  curDate.toISODate(); //resultData[dataType][0].startDate;
                let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
                let lastModified = resultData.activities.length > 0? resultData.activities[0].lastModified: "";
    

                let oldDocument = await prisma.fitbit_data.findFirst({
                    where: {
                        compositeId: compositeId
                    }
                });
    
                let newDocument = await prisma.fitbit_data.upsert({
                    where: {
                        compositeId: compositeId
                    },
                    update: {
                        lastModified: lastModified,
                        content: resultData
                    },
                    create: {
                        compositeId: compositeId,
                        dataType: dataType,
                        ownerId: updatedUserInfo.fitbitId,
                        dateTime: dateTime,
                        lastModified: lastModified,
                        content: resultData
                    },
                });

                // now, see if I can calculate the diff
                let documentDiff = {};

                if(oldDocument == null){
                    documentDiff = GeneralUtility.getObjectAsJSONDiff({}, newDocument);
                }
                else{
                    documentDiff = GeneralUtility.getObjectAsJSONDiff(oldDocument, newDocument);
                }

                //console.log(`documentDiff: ${JSON.stringify(documentDiff, null, 2)}`);

                // now, insert the diff
                let diffDocument = await prisma.update_diff.create({
                    data: {
                        collectionName: "fitbit_data",
                        documentId: newDocument.id,
                        documentDiff: documentDiff
                    }
                });
            }


            resultList.push(activityResult);

        }

        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${curResult.data} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };

        
    }

    static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true, numOfDays=1){
        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: ${userInfo.username}, ${targetDate}, numOfDays: ${numOfDays}`);

        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: token validation: ${validateTokenResult.value}`);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // use updatedUserInfo from this point

        // now query the data


        let resultList = [];
        // now query the data
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDate.plus({"days": i});

            const activityResult = await FitbitHelper.getHeartRateAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, curDate)
            .then((responseData) => {
              console.log(
                `FitbitHelper.getHeartRateAtDateForFitbitId: ${JSON.stringify(
                  responseData
                )}`
              );
        
              /*
              if(responseData.status == 400){
                  // cannot auth: Bad Request
                  // I supposed this mean we need to authenticate again
              }
              */
        
              //accessToken = responseData.access_token;
        
              // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
              //refreshToken = responseData.refresh_token;
        
              // To Do: ideally, store both
              //updateToken(hashCode, accessToken, refreshToken);
        
              return {value: "success", data: responseData};
        
              //res.status(200).json({ message: "authentication success" });
            })
            .catch((error) => {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);
        
                console.log(`Error response`);
                // which means, authentication falil
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
        
                console.log(`Error request`);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
        
                console.log("Error else");
              }
              //res.status(error.response.status).json({ response: inspect(error.response.data) });
        
              let resultObj = eval(`(${inspect(error.response.data)})`);
              return {value: "failed", data: resultObj};
            });
    
    
            console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: query result: ${activityResult.value}`);
    
    
            if(insertToDB == true && activityResult.value == "success"){
                resultData = activityResult.data;
    
                // now insert the data
                // To Do: decide the schema
                let dataType = "activities-heart";
                let dateTime = curDate.toISODate(); //resultData[dataType][0].dateTime;
                let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
                let lastModified = ""; // no this field for heart rate
    
                const updateRecord = await prisma.fitbit_data.upsert({
                    where: {
                        compositeId: compositeId
                    },
                    update: {
                        lastModified: lastModified,
                        content: resultData
                    },
                    create: {
                        compositeId: compositeId,
                        dataType: dataType,
                        ownerId: updatedUserInfo.fitbitId,
                        dateTime: dateTime,
                        lastModified: lastModified, 
                        content: resultData
                    },
                })
            }


            resultList.push(activityResult);

        }



        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${curResult.data} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };
        
    }

    static async queryAndStoreFitbitIntradayDataAtTargetDateForUser(userInfo, fitbitIntradayDataType, targetDate, insertToDB=true, numOfDays=1, suppressTokenValidation=false){
        console.log(`${this.name}.queryAndStoreFitbitIntradayDataAtTargetDateForUser: ${userInfo.username}, ${fitbitIntradayDataType}, ${targetDate}, numOfDays: ${numOfDays}, suppressTokenValidation: ${suppressTokenValidation}`);

        // .toISODate() -> what will be used by FitbitHelper
        console.log(`${this.name}.queryAndStoreFitbitIntradayDataAtTargetDateForUser: targetDate.toISODate:, ${targetDate.toISODate()}`);


        let resultData = {};

        let updatedUserInfo = userInfo;

        if( !suppressTokenValidation ){

            let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
            console.log(`${this.name}.queryAndStoreFitbitIntradayDataAtTargetDateForUser: token validation: ${validateTokenResult.value}`);


            if(validateTokenResult.value == "success"){
                updatedUserInfo = validateTokenResult.data;
            }
            else{
                // cannot update userInfo, need to abort
                return validateTokenResult;
            }
        }

        // use updatedUserInfo from this point

        let resultList = [];
        // now query the data
        
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDate.plus({"days": i});
            let resultObj = {};

            let activityResult = await FitbitHelper.getIntradayDataBetweenDateRangeForFitbitId(updatedUserInfo.fitbitId, fitbitIntradayDataType, updatedUserInfo.accessToken, curDate, curDate)
            .then((responseData) => {
              console.log(`FitbitHelper.getIntradayDataBetweenDateRangeForFitbitId responseData.length: ${JSON.stringify(responseData.length)}`);
              return {value: "success", status: "response",  data: responseData};
            })
            .catch((error) => {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);
        
                console.log(`Error response`);

                const { data, status, headers } = error.response;

                let forResponse = { data, status, headers };

                return {value: "failed", status: "response-error",  data: forResponse};


                // which means, authentication falil
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(`[error.request]: ${error.request}`);

                return {value: "failed", status: "no-response",  data: {}};

              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
        
                console.log('Error', error.message);

                return {value: "failed", status: "request-error",  data: error.message};
              }
              //res.status(error.response.status).json({ response: inspect(error.response.data) });
        
              /*
              let resultObj = eval(`(${inspect(error.response.data)})`);
              return {value: "failed", data: resultObj};
              */
            });
    
            console.log(`${this.name}.queryAndStoreFitbitIntradayDataAtTargetDateForUser [${curDate.toFormat('yyyy-MM-dd')}]: query result: ${activityResult.value}`);
    
    
            if(insertToDB == true && activityResult.value == "success"){
                resultData = activityResult.data;
    
                // now insert the data
                // To Do: decide the schema
                let dataType = fitbitIntradayDataType;
    
                // targetDate.toISODate()
                let dateTime =  curDate.toISODate(); //resultData[dataType][0].startDate;
                let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
                let lastModified = "";// resultData.activities.length > 0? resultData.activities[0].lastModified: "";

                let oldDocument = await prisma.fitbit_data.findFirst({
                    where: {
                        compositeId: compositeId
                    }
                });

                //oldDocument = oldDocument == null? {}: oldDocument;

                let newDocument = await prisma.fitbit_data.upsert({
                    where: {
                        compositeId: compositeId
                    },
                    update: {
                        lastModified: lastModified,
                        content: resultData
                    },
                    create: {
                        compositeId: compositeId,
                        dataType: dataType,
                        ownerId: updatedUserInfo.fitbitId,
                        dateTime: dateTime,
                        lastModified: lastModified,
                        content: resultData
                    },
                });

                // now, see if I can calculate the diff
                let documentDiff = {};

                if(oldDocument == null){
                    documentDiff = GeneralUtility.getObjectAsJSONDiff({}, newDocument);
                }
                else{
                    documentDiff = GeneralUtility.getObjectAsJSONDiff(oldDocument, newDocument);
                }

                //console.log(`documentDiff: ${JSON.stringify(documentDiff, null, 2)}`);

                // now, insert the diff
                let diffDocument = await prisma.update_diff.create({
                    data: {
                        collectionName: "fitbit_data",
                        documentId: newDocument.id,
                        documentDiff: documentDiff
                    }
                });

            }
    
    
            resultList.push(activityResult);


        }
        



        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${JSON.stringify(curResult.data)} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };

        
    }


    static async queryAndStoreFitbitSummaryByFitbitUpdate(fitbitUpdate, insertToDB=true, suppressTokenValidation=false){
        console.log(`${this.name}.queryAndStoreFitbitSummaryByFitbitUpdate: ${JSON.stringify(fitbitUpdate)}`);

        let resultData = {};

        // get the user first
        let userInfo = await prisma.users.findFirst({
            where: {
                fitbitId: fitbitUpdate.ownerId
            }
        });

        let dateString = fitbitUpdate.date;
        let targetDate = DateTime.fromISO(fitbitUpdate.date);

        console.log(`${this.name}.queryAndStoreFitbitSummaryByFitbitUpdate userInfo: ${JSON.stringify(userInfo)}`);

        const summaryResult = await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, insertToDB, 1, suppressTokenValidation);
        
        
        //const heartrateResult = await DatabaseUtility.queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB, 1);

        //let resultStatus = summaryResult.value == "success" && heartrateResult.value == "success" ? "success" : "failed";

        let resultStatus = summaryResult.value == "success" ? "success" : "failed";

        let resultErrorMessage = "";
        if (summaryResult.value == "failed") {
            resultErrorMessage += `${summaryResult.data}`;
        }
        /*
        if (heartrateResult.value == "failed") {
            resultErrorMessage += `${heartrateResult.data}`;
        }
        */

        //let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([fitbitUpdate.ownerId, fitbitUpdate.collectionType, fitbitUpdate.date]);

        return {
            value: resultStatus,
            data: resultErrorMessage,
            update: fitbitUpdate,
            body: [{
                value: summaryResult.value,
                ownerId: userInfo.fitbitId,
                dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
                dateTime: dateString
            }
            /*
            , {
                value: heartrateResult.value,
                ownerId: userInfo.fitbitId,
                dataType: "activities-heart",
                dateTime: dateString
            }
            */
        ]
        };
    }

    static async queryAndStoreFitbitIntradayDataByFitbitUpdate(fitbitUpdate, fitbitIntradayDataType, insertToDB=true, suppressTokenValidation=false){
        console.log(`${this.name}.queryAndStoreFitbitIntradayDataByFitbitUpdate: ${JSON.stringify(fitbitUpdate)}`);

        let resultData = {};

        // get the user first
        let userInfo = await prisma.users.findFirst({
            where: {
                fitbitId: fitbitUpdate.ownerId
            }
        });

        let dateString = fitbitUpdate.date;
        let targetDate = DateTime.fromISO(fitbitUpdate.date);

        console.log(`${this.name}.queryAndStoreFitbitIntradayDataByFitbitUpdate userInfo: ${JSON.stringify(userInfo)}`);


        // FitbitHelper.queryAndStoreFitbitIntradayHeartRateAtTargetDateForUser:
        const intradayDataResult = await DatabaseUtility.queryAndStoreFitbitIntradayDataAtTargetDateForUser(userInfo, targetDate, insertToDB, 1, suppressTokenValidation);

        //const summaryResult = await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, insertToDB, 1);
        
        
        //const heartrateResult = await DatabaseUtility.queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB, 1);

        //let resultStatus = summaryResult.value == "success" && heartrateResult.value == "success" ? "success" : "failed";

        let resultStatus = intradayDataResult.value == "success" ? "success" : "failed";

        let resultErrorMessage = "";
        if (intradayDataResult.value == "failed") {
            resultErrorMessage += `${intradayDataResult.data}`;
        }

        return {
            value: resultStatus,
            data: resultErrorMessage,
            update: fitbitUpdate,
            body: [{
                value: intradayDataResult.value,
                ownerId: userInfo.fitbitId,
                dataType: GeneralUtility.ITBIT_INTRADAY_DATA_TYPE_HEART,
                dateTime: dateString
            }
            ]
        };
    }

    static async queryAndStoreFitbitDataByFitbitUpdate(fitbitUpdate, insertToDB=true){
        console.log(`${this.name}.queryAndStoreFitbitDataByFitbitUpdate: ${JSON.stringify(fitbitUpdate)}`);

        let resultData = {};

        // get the user first
        let userInfo = await prisma.users.findFirst({
            where: {
                fitbitId: fitbitUpdate.ownerId
            }
        });

        let dateString = fitbitUpdate.date;
        let targetDate = DateTime.fromISO(fitbitUpdate.date);

        console.log(`${this.name}.queryAndStoreFitbitDataByFitbitUpdate username: ${JSON.stringify(userInfo.username)}`);


        // ensure that token is valid

        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 5 * 60);
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: token validation: ${validateTokenResult.value}`);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // now, do the following queries with suppressTokenValidation=true

        let suppressTokenValidation = true;
        let resultStatus = "success";
        let resultErrorMessage = "";

        // step intraday
        const intraStepResult = await DatabaseUtility.queryAndStoreFitbitIntradayDataAtTargetDateForUser(updatedUserInfo, GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP, targetDate, insertToDB, 1, suppressTokenValidation);

        let intraStepResultStatus = intraStepResult.value == "success" ? "success" : "failed";

        if (intraStepResult.value == "failed") {
            resultStatus = "failed";
            resultErrorMessage += `${intraStepResult.data}`;
        }

        // heart rate intraday
        const intraHeartResult = await DatabaseUtility.queryAndStoreFitbitIntradayDataAtTargetDateForUser(updatedUserInfo, GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_HEART, targetDate, insertToDB, 1, suppressTokenValidation);

        let intraHeartResultStatus = intraHeartResult.value == "success" ? "success" : "failed";

        let intraHeartResultErrorMessage = "";
        if (intraHeartResult.value == "failed") {
            resultStatus = "failed";
            resultErrorMessage += `${intraHeartResult.data}`;
        }

        // activity summary
        const summaryActivityResult = await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(updatedUserInfo, targetDate, insertToDB, 1, suppressTokenValidation);
        
        let summaryActivityStatus = summaryActivityResult.value == "success" ? "success" : "failed";

        let summaryActivityResultErrorMessage = "";
        if (summaryActivityResult.value == "failed") {
            resultStatus = "failed";
            resultErrorMessage += `${summaryActivityResult.data}`;
        }
        /*
        if (heartrateResult.value == "failed") {
            resultErrorMessage += `${heartrateResult.data}`;
        }
        */

        //let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([fitbitUpdate.ownerId, fitbitUpdate.collectionType, fitbitUpdate.date]);

        

        return {
            value: resultStatus,
            data: resultErrorMessage,
            update: fitbitUpdate,
            body: [
                {
                    value: intraStepResult.value,
                    ownerId: userInfo.fitbitId,
                    dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP,
                    dateTime: dateString
                },
                {
                    value: intraHeartResult.value,
                    ownerId: userInfo.fitbitId,
                    dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_HEART,
                    dateTime: dateString
                },
                {
                    value: summaryActivityResult.value,
                    ownerId: userInfo.fitbitId,
                    dataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY,
                    dateTime: dateString
                }
            /*
            , {
                value: heartrateResult.value,
                ownerId: userInfo.fitbitId,
                dataType: "activities-heart",
                dateTime: dateString
            }
            */
        ]
        };
    }

}