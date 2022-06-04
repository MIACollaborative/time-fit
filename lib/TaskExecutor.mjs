
import { DateTime } from "luxon";
import TwilioHelper from "./TwilioHelper.mjs";

//import prisma from "./prisma.mjs";

import GeneralUtility from "../lib/GeneralUtility.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";

export default class TaskExecutor {


  constructor() {}

  static async executeTaskForUserListForDatetime(taskSpec, userList, datetime){
    // Step 1: use grouop to filter out the participants to be considered for this task
    //let userList = this.participantList;
    

    console.log(`executeTaskForUserListForDatetime taskSpec.enabled: ${taskSpec.enabled} for ${taskSpec.label}`);

    let actionResultList = [];

    if(taskSpec.enabled == false){
        return actionResultList;
    }

    console.log(`executeTask: userList: ${JSON.stringify(userList)}`);

    console.log(`executeTask: ignoreTimezone: ${taskSpec.ignoreTimezone}`);

    // isTimezoneSet
    if(taskSpec.ignoreTimezone == false){
        userList = userList.filter((userInfo) => {
            return GeneralUtility.isTimezoneSet(userInfo);
        });
        console.log(`isTimezoneSet: userList: ${JSON.stringify(userList)}`);
    }

    userList = userList.filter((userInfo) => {
        return TaskExecutor.isGroupForUser(taskSpec.group, userInfo);
    });

    console.log(`isGroupForUser: userList: ${JSON.stringify(userList)}`);
    console.log(`\n`);

    // ok, so now we will only consider thses users in the userList

    // Step 2: Now, checking the local time against the "checkPoint" specified in the taskSpec
    userList = userList.filter((userInfo) => {
        return TaskExecutor.isCheckPointForUser(taskSpec.checkPoint, userInfo, datetime);
    });

    console.log(`isCheckPointForUser: userList: ${JSON.stringify(userList)}`);
    console.log(`\n`);

    // Step 3: Now, do the randomization and log the outcome regardless
    // actually, the randomizaion should be done for each qualified user

    // Step 4: execute the action for each user

    
    
    for(let i = 0; i < userList.length; i++ ){
        let userInfo = userList[i];
        let chanceChoice = TaskExecutor.obtainChoiceWithRandomization(taskSpec.randomization);
        let randomNumber = chanceChoice.randomNumber;
        let theAction = chanceChoice.theChoice.action;
        console.log(`executeTaskForUserListForDatetime (${userInfo.username}): chanceChoice: ${JSON.stringify(chanceChoice)}`);
        let taskLogObj = {};

        taskLogObj["taskLabel"] = taskSpec.label;
        taskLogObj["username"] = userInfo.username;
        taskLogObj["randomizationResult"] = chanceChoice;

        // extractUserInfoCache
        taskLogObj["userInfoCache"] = GeneralUtility.extractUserInfoCache(userInfo);

        let compositeResult = await TaskExecutor.executeActionForUser(theAction, userInfo, datetime);

        console.log(`executeTaskForUserListForDatetime.compositeResult: ${JSON.stringify(compositeResult)}`);
        taskLogObj["messageLabel"] = compositeResult["messageLabel"];


        taskLogObj["executionResult"] = compositeResult["executionResult"];





        actionResultList.push(taskLogObj);
        console.log(`executeTaskForUserListForDatetime (${userInfo.username}) taskLogObj: ${JSON.stringify(taskLogObj)}`);



    }

    // To Do: log the task, randomization, and action result

    return actionResultList;
  }

  static obtainChoiceWithRandomization(randomizationSpec){

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
    if( randomizationSpec.enabled == false){
        return randomizationSpec.outcome[0];
    }

    // if not, then we need to do randomization
    // now, scan everything in the outcome list and use the "chance" to do the randomization


    const {randomNumber, theChoice} = TaskExecutor.randomizeSelection(randomizationSpec.outcome);

    /*
    let theAction = {
        type: "noAction"
    };
    if(theChoice != undefined){
        theAction = theChoice.action;
    }
    */

    
    return {randomNumber, theChoice};

  }

  static async executeActionForUser(theAction, userInfo, datetime){
      console.log(`executeActionForUser (${userInfo.username}): ${JSON.stringify(theAction)}`);
      let record = {
          messageLabel: "", //null,
          executionResult: null
      };

      record.action = theAction;
      let messageInfo;
      let messageBody="";
      let gifURL="";
      let surveyURL = "";

      switch(theAction.type){
        case "messageLabel":
            // find the message through messageLabel
            messageInfo = await DatabaseUtility.findMessageByLabel(theAction.messageLabel);
            console.log(`executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`);

            // for logging
            record.messageLabel = messageInfo.label;

            surveyURL = await GeneralUtility.extractSurveyLinkFromAction(theAction);

            console.log(`executeActionForUser surveyURL: ${surveyURL}`);

            messageBody = GeneralUtility.composeUserMessageForTwilio(userInfo, messageInfo, surveyURL);
            
            if (messageInfo.gif != undefined){
                gifURL = `${process.env.NEXTAUTH_URL}/image/gif/${messageInfo.gif}.gif`;
            }

            console.log(`messageBody: ${messageBody}`);
            console.log(`Gif url: ${gifURL}`);

            record.executionResult = {
                type: "twilio",
                value: await TwilioHelper.sendMessage(userInfo.phone, messageBody, gifURL.length > 0? [gifURL]:[])
            };
            
            
            console.log(`executeActionForUser record.executionResult: ${JSON.stringify(record.executionResult)}`);
            break;
        case "messageGroup":
            messageInfo = await DatabaseUtility.findMessageByGroup(theAction.messageGroup, theAction.avoidHistory, userInfo.username);
            console.log(`executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`);

            // for logging
            record.messageLabel = messageInfo.label;

            surveyURL = GeneralUtility.extractSurveyLinkFromAction(theAction);
            console.log(`executeActionForUser surveyURL: ${surveyURL}`);


            messageBody = GeneralUtility.composeUserMessageForTwilio(userInfo, messageInfo, surveyURL);
            if (messageInfo.gif != undefined){
                gifURL = `${process.env.NEXTAUTH_URL}/image/gif/${messageInfo.gif}.gif`;
            }
            console.log(`messageBody: ${messageBody}`);
            console.log(`Gif url: ${gifURL}`);
            record.executionResult = {
                type: "twilio",
                value: await TwilioHelper.sendMessage(userInfo.phone, messageBody, gifURL.length > 0? [gifURL]:[])
            };
            console.log(`executeActionForUser record.executionResult: ${JSON.stringify(record.executionResult)}`);
            break;
        case "retrieveFitbitData":
            /*
            // for fitbit
            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
            retrievalStartDate: {
                reference: "today",
                offset: {
                    type: "minus",
                    value: {days: 1}
                }
            },
            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
            dataPeriod: "1d"
            */



            // Step 1: calculate the start date
            let nowDate = datetime; //DateTime.now();
            let targetDate = nowDate;
            let dateString;
            let numOfDays = 1;
            // Step 1.1: determine number of days
            switch(theAction.dataPeriod){
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
            if( theAction.retrievalStartDate.reference == "today"){
                // the only case being supported for now
                if(theAction.retrievalStartDate.offset.type == "minus"){
                    targetDate = nowDate.minus(theAction.retrievalStartDate.offset.value).startOf("day");
                }
                else{
                    targetDate = nowDate.plus(theAction.retrievalStartDate.offset.value);
                }

                dateString = targetDate.toFormat('yyyy-MM-dd');
            }

            const summaryResult = await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, true, numOfDays);
            const heartrateResult = await DatabaseUtility.queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, true, 1);

            let resultStatus = summaryResult.value == "success" && heartrateResult.value == "success"? "success": "failed";

            // eResult.value.errorMessage
            let resultErrorMessage = "";
            if(summaryResult.value == "failed"){
                resultErrorMessage += `${summaryResult.data}`;
            }
            if(heartrateResult.value == "failed"){
                resultErrorMessage += `${heartrateResult.data}`;
            }

            record.executionResult = {
                type: "fitbit",
                value: {
                    status: resultStatus,
                    body: [{
                        value: summaryResult.value,
                        ownerId: userInfo.fitbitId,
                        dataType: "activities",
                        dateTime: dateString,
                        dataPeriod: theAction.dataPeriod
                    }, {
                        value: heartrateResult.value,
                        ownerId: userInfo.fitbitId,
                        dataType: "activities-heart",
                        dateTime: dateString,
                        dataPeriod: theAction.dataPeriod
                    }]
                }
            };

            console.log(`executeActionForUser record.executionResult: ${JSON.stringify(record.executionResult)}`);
            break;
        default:
            // noAction
            // do nothing
            record.executionResult = theAction;
            break;
      }

      console.log(`executeActionForUser record: ${JSON.stringify(record)}`);
      return record;
  }

  static randomizeSelection(choiceList){
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


    for(let i = 0; i < choiceList.length; i++){
        let choice = choiceList[i];

        let cChance = choice.chance;

        allowance = allowance - cChance;


        // Example: 0.5 + 0.5
        // since 0 will be count as the first 0.5, so if allowance == 0, it should be count as the next one
        if(allowance < 0 ){
            theChoice = choice;
            break;
        }
    }


    // now, what to do if theChoice is undefined?
    // meaning, the randomization indicate not to take action
    
    
    
    
    return {
        randomNumber: randNumber,
        theChoice: theChoice
    } ;
  }

  static isGroupForUser(groupSpec, userInfo){
    if(groupSpec.type == "all"){
        return true;
    }
    else if(groupSpec.type == "list"){
        let isListed = false;
        if( groupSpec.list.includes(userInfo.username)){
            isListed = true;
        }
        return isListed;
    }
    else if(groupSpec.type == "group"){
        let groupMatched = false;
        Object.keys(groupSpec.membership).forEach((groupName) => {
            if(groupSpec.membership[groupName].includes(userInfo[groupName])){
                groupMatched = true;
            }
        });
        return groupMatched;
    }

    return false;
  }

  static isCheckPointForUser(checkPoint, userInfo, now){
    // Will return true if the time is right for this user. If not, return false;
    let result = false;

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
        }
    },
    */

    // step 0: if checkPoint is to be Ignore
    if(checkPoint.type == "ignore"){
        return true;
    }

    // step 1: identify what time attribute should be used for comparison

    // step 1.1: use timezone to get local time
    //let now = DateTime.now();
    console.log(`isCheckPointForUser now: ${now}`);
    let nowUTC = now.toUTC();
    console.log(`isCheckPointForUser nowUTC: ${nowUTC}`);

    let localTimeForUser = GeneralUtility.getLocalTime(now, userInfo.timezone);
    let localWeekIndex = localTimeForUser.weekday;

    console.log(`isCheckPointForUser.localTimeForUser: ${localTimeForUser}`);
    console.log(`isCheckPointForUser.localWeekIndex: ${localWeekIndex}`);

    
    //DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({year: nowUTC.year, month: nowUTC.month, day: nowUTC.day, second: nowUTC.second, millisecond: nowUTC.millisecond});

    // Step 1.2: check whether the weekday even pass (if it is the right day)
    // [Note] I will likely have to deal with people go to bed at 12:00 AM later

    if(!checkPoint.reference.weekIndexList.includes(localWeekIndex)){
        // this is not the right week index
        console.log(`isCheckPointForUser weekIndex not included: ${localWeekIndex}/${checkPoint.reference.weekIndexList}`);
        return false;
    }
    else{
        console.log(`isCheckPointForUser weekIndex included: ${localWeekIndex}/${checkPoint.reference.weekIndexList}`);
    }

    // ok. so now at least the weekday (or weekend) is correct (or included)

    let targetTime = undefined;
    //let localTargetTime = undefined;

    let diffDateTime = undefined;

    console.log(`isCheckPointForUser checkPoint.reference.type: ${checkPoint.reference.type}`);
    console.log(`isCheckPointForUser checkPoint.reference.value: ${checkPoint.reference.value}`);

    if(checkPoint.reference.type == "fixed"){
        // value: "8:00 PM"
        let hourMinuteString = checkPoint.reference.value;
        // ToDo: need to copy the datetime and then ooverwrite with the value here
        let userReferenceTime = DateTime.fromFormat(hourMinuteString, "t", {zone: userInfo.timezone});


        let userReferenceUTCTime = GeneralUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);

        targetTime = userReferenceUTCTime;

        // need to check if the time is on the right date locally
        console.log(`targetTime: ${targetTime}`);

    }
    else if (checkPoint.reference.type == "preference"){
        // (if preference) (wakeupTime, bedTime, createdAt)
        // get local time

        let referenceTimePropertyName = "";

        console.log(`isCheckPointForUser checkPoint.reference.value: ${checkPoint.reference.value}`);
        
        if(checkPoint.reference.value == "wakeupTime"){
            if(localWeekIndex <= 5){
                referenceTimePropertyName = "weekdayWakeup";
            }
            else{
                referenceTimePropertyName = "weekendWakeup";
            }
        }
        else if(checkPoint.reference.value == "bedTime"){
            if(localWeekIndex <= 5){
                referenceTimePropertyName = "weekdayBed";
            }
            else{
                referenceTimePropertyName = "weekendBed";
            }
            
        }
        else{
            referenceTimePropertyName = checkPoint.reference.value;
        }

        console.log(`isCheckPointForUser referenceTimePropertyName: ${referenceTimePropertyName}`);
        

        let userReferenceTime = DateTime.fromISO(userInfo[referenceTimePropertyName]);

        console.log(`isCheckPointForUser userReferenceTime: ${userReferenceTime}, type: ${typeof userReferenceTime}`);

        let userReferenceUTCTime = GeneralUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);

        console.log(`isCheckPointForUser userReferenceUTCTime: ${userReferenceUTCTime}`);

        targetTime = userReferenceUTCTime;

        console.log(`targetTime: ${targetTime}`);



    }

    // absolute vs. relative
    console.log(`isCheckPoint checkPoint.type: ${checkPoint.type}`);
    if( checkPoint.type == "absolute"){
        // do nothing
    }
    else if( checkPoint.type == "relative"){
        console.log(`isCheckPointForUser checkPoint.offset.value: ${JSON.stringify(checkPoint.offset.value)}`);
        if( checkPoint.offset.type == "plus"){
            targetTime = targetTime.plus(checkPoint.offset.value);
        }
        else if( checkPoint.offset.type == "minus"){
            targetTime = targetTime.minus(checkPoint.offset.value);
        }
    }

    console.log(`targetTime after offset: ${targetTime}`);



    diffDateTime = GeneralUtility.diffDateTime(targetTime, nowUTC, "minutes");

    console.log(`isCheckPoint diffDateTime: ${diffDateTime}, minutes: ${diffDateTime.toObject().minutes}, hours: ${diffDateTime.toObject().minutes/60}`);

    if( diffDateTime.toObject().minutes != 0){
        result = false;
    }
    else{
        result = true;
    }

    // ok, by now, we shoudl have verify whether at least the checkPoint match




    return result;
  }

}