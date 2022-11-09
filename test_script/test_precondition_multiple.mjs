import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import {DateTime} from "luxon";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

let userList = await prisma.users.findMany({
    where: {
        username: {
          contains: "test",
        },
      },
});

let userInfoList = JSON.parse(JSON.stringify(userList, replacer));

/*
let userInfo = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});

userInfo = JSON.parse(JSON.stringify(userInfo, replacer));
*/

let referenceDateStr = "today";

let sampleConditionObj = {
    // whether a task has precondition to consider.
    enabled: true,

    // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
    conditionRelationship: "and",

    // Condition list: list of conditions to be checked
    conditionList: [
        // Condition type: person, surveyFilledByThisPerson, timeInPeriod, hasFitbitUpdateForPersonByDateRange, hasHeartRateIntradayMinutesAboveThresholdForPersonByDate
        //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

        // Participants can be on either baseline or intervention to receive fitbit wearing reminders
        {
            // Check if participant's Fitbit has detected activity the past 2 days - should return False
            type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
            opposite: true, // participant has been wearing = True -> False
            criteria: {
                // Id list: list of Qualtrics survey Ids to check
                idList: [""],

                // Whehter we want all ("and") surveys to be filled, at least one ("or") survey to be filled, or ("not any").
                // Use ("not any") for checking survey NOT filled, etc.
                idRelationship: "not any", //not used for fitbit wearing

                // check whether minutes >= wearingLowerBoundMinutes
                wearingLowerBoundMinutes: 60 * 8, // Day of checking for adherence (wakeup+1hr) will always return adherent, thus won't be counted towards Fitbit non-worn day.

                period: {
                    // Start: the starting piont of the time window to consider
                    // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                    // reference:
                    // now: current time
                    // today: start of today (00:00:00 am)
                    start: {
                        reference: "today",
                        offset: { type: "minus", value: { days: 2 } } // check today since 00:00:00 am
                    },
                    // End doesn't matter for Fitbit wearing
                    // Removing it means we are consider a time window up to this point
                    end: {
                        // reference:
                        // now: current time
                        // today: end of today (23:59:59 pm)
                        reference: "today",
                        // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                        // Plus 0 hours basically means using the reference point directly
                        offset: { type: "minus", value: { days: 1 } }
                    }
                }
            }
        },
        {
            // Check if participant's Fitbit has detected activity the past 5 days - should return False
            type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
            opposite: true, // participant has been wearing = True -> False
            criteria: {
                // Id list: list of Qualtrics survey Ids to check
                idList: [""],

                // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                // Use ("not any") for checking survey NOT filled, etc.
                idRelationship: "or", //not used for fitbit wearing

                // check whether minutes >= wearingLowerBoundMinutes
                wearingLowerBoundMinutes: 60 * 8,                            

                period: { // check between: the start of the day of two days ago - today
                    // Start: the starting piont of the time window to consider
                    // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                    // reference:
                    // now: current time
                    // today: start of today (00:00:00 am)
                    start: {
                        reference: "today",
                        offset: { type: "minus", value: { days: 5 } }
                    },
                    // End doesn't matter for Fitbit wearing
                    // Removing it means we are consider a time window up to this point
                    end: {
                        // reference:
                        // now: current time
                        // today: end of today (23:59:59 pm)
                        reference: "today",

                        // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                        // Plus 0 hours basically means using the reference point directly
                        offset: { type: "minus", value: { days: 3 } }
                    }
                }
            }
        },
        // timeInPeriod -> check time constraint based on a time window
        // Note: have a draft implemention, but might not be used or well tested.
    ]
}

// checkOneConditionForUser(condition, userInfo, dateTime)




//let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());

let checkResultList = [];

for (let i = 0; i < userInfoList.length; i++) {
    let userInfo = userInfoList[i];
    let testDate = DateTime.fromFormat("11/09/2022, 12:00:00 PM", "F", { zone: userInfo.timezone });
    let checkResult = await TaskExecutor.isPreConditionMetForUser(sampleConditionObj, userInfo, testDate);

    checkResultList.push(checkResult);
}

for (let i = 0; i < userInfoList.length; i++) {
    let userInfo = userInfoList[i];
    let checkResult = checkResultList[i];

    console.log(`[Test] for ${userInfo.username}: result: ${checkResult}`);

}