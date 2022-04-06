
import { DateTime } from "luxon";
import TwilioHelper from "./TwilioHelper.mjs";
import MyUtility from "../lib/MyUtility.mjs";
import prisma from "./prisma.mjs";
export default class TaskExecutor {


  constructor() {}

  static executeTask(taskSpec, userList){
    // Step 1: use grouop to filter out the participants to be considered for this task
    //let userList = this.participantList;

    console.log(`executeTask: userList: ${JSON.stringify(userList)}`);

    userList = userList.filter((userInfo) => {
        return TaskExecutor.isGroupForUser(taskSpec.group, userInfo);
    });

    console.log(`isGroupForUser: userList: ${JSON.stringify(userList)}`);
    console.log(`\n`);

    // ok, so now we will only consider thses users in the userList

    // Step 2: Now, checking the local time against the "checkPoint" specified in the taskSpec
    userList = userList.filter((userInfo) => {
        return TaskExecutor.isCheckPointForUser(taskSpec.checkPoint, userInfo);
    });

    console.log(`isCheckPointForUser: userList: ${JSON.stringify(userList)}`);
    console.log(`\n`);

    // Step 3: Now, do the randomization and log the outcome regardless
    // actually, the randomizaion should be done for each qualified user
    


    // Step 4: execute the action for each user
    let actionResultList = userList.map((userInfo) => {
        let theAction = TaskExecutor.obtainActionWithRandomization(taskSpec.randomization);
        console.log(`isCheckPointForUser (${userInfo.username}): theAction: ${JSON.stringify(theAction)}`);
        return TaskExecutor.executeActionForUser(theAction, userInfo);
    });

    // To Do: log the task, randomization, and action result

    return actionResultList;
  }

  static obtainActionWithRandomization(randomizationSpec){

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


    let theChoice = TaskExecutor.randomizeSelection(randomizationSpec.outcome);
    let theAction = {
        type: "noAction"
    };
    if(theChoice != undefined){
        theAction = theChoice.action;
    }

    
    return theAction;

  }

  static async executeActionForUser(theAction, userInfo){
      console.log(`executeActionForUser (${userInfo.username}): ${JSON.stringify(theAction)}`);
      let record = {};

      record.action = theAction;

      switch(theAction.type){
        case "messageLabel":
            // find the message through messageLabel
            let messageInfo = await MyUtility.findMessageByLabel(theAction.messageLabel);
            console.log(`executeActionForUser messageInfo: ${JSON.stringify(messageInfo)}`);
            let messageBody = MyUtility.composeUserMessageForTwilio(userInfo, messageInfo, "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8");
            let gifURL = `https://walktojoy.net/image/gif/${theAction.gif}.gif`;
            TwilioHelper.sendMessage(userInfo.phone, messageBody, [gifURL])
            break;
        case "messageGroup":
            break;
        default:
            // noAction
            // do nothing
            break;
      }

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
    
    
    
    
    return theChoice;
  }

  static isGroupForUser(groupSpec, userInfo){
    if(groupSpec.type == "all"){
        return true;
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

  static isCheckPointForUser(checkPoint, userInfo){
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
    let now = DateTime.now();
    console.log(`isCheckPointForUser now: ${now}`);
    let nowUTC = now.toUTC();
    console.log(`isCheckPointForUser nowUTC: ${nowUTC}`);

    let localTimeForUser = MyUtility.getLocalTime(now, userInfo.timezone);
    let localWeekIndex = localTimeForUser.weekday; //MyUtility.getWeekdayOrWeekend();

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
        targetTime = DateTime.fromFormat(hourMinuteString, "t", {zone: userInfo.timezone});

        //localTargetTime = MyUtility.getLocalTime(targetTime, userInfo.timezone);

        // need to check if the time is on the right date locally
        console.log(`targetTime: ${targetTime}`);


        // To Do: need to determine whether it is a match

        //diffDateTime = MyUtility.diffDateTime(targetTime, nowUTC, "minutes");

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

        let userReferenceUTCTime = MyUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);

        console.log(`isCheckPointForUser userReferenceUTCTime: ${userReferenceUTCTime}`);

        targetTime = userReferenceUTCTime;

        console.log(`targetTime: ${targetTime}`);

        // To Do: need to determine whether it is a match

        


        // let localTimeForUser = MyUtility.getLocalTime(now, userInfo.timezone);
        // let weekdayIndex = MyUtility.getWeekdayOrWeekend(localTimeForUser);

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



    diffDateTime = MyUtility.diffDateTime(targetTime, nowUTC, "minutes");

    console.log(`isCheckPoint diffDateTime: ${diffDateTime}, minutes: ${diffDateTime.toObject().minutes}, hours: ${diffDateTime.toObject().minutes/60}`);

    if( diffDateTime.toObject().minutes != 0){
        return false;
    }

    // ok, by now, we shoudl have verify whether at least the checkPoint match




    return result;
  }

}