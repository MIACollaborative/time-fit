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
        // Condition type: person, surveyFilledByThisPerson, timeInPeriod
        //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type
        /*
        {
            // person -> check a participant's property
            // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
            type: "person",
            criteria: {
                phase: "baseline" // intervention +2days
            }
        },
        */
        {
            type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
            opposite: false, // participant did NOT adhere to wearing fitbit for +8 hours for 3 days = true
            criteria: {
                idList: [""],

                // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                // Use ("not any") for checking survey NOT filled, etc.
                idRelationship: "not any", // used for hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange

                // check whether minutes >= wearingLowerBoundMinutes
                wearingLowerBoundMinutes: 60 * 8,
                // REACTIVATE AFTER TESTING
                // wearingDayLowerBoundCount: 3, // if specified, idRelationshi ignored; don't make it 0

                // DELETE AFTER TESTING
                wearingDayLowerBoundCount: 3,

                period: {
                    // Start: the starting piont of the time window to consider
                    // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                    start: {
                        // REACTIVATE AFTER TESTING
                        // reference: "joinAtDate",
                        // offset: { type: "minus", value: { days: 0 } } // checks for wearing adherence the last 6 days

                        // DELETE AFTER TESTING
                        reference: "today",
                        offset: { type: "minus", value: { days: 3 } }
                    },
                    // reference:
                    // now: current time
                    // today: start of today (00:00:00 am)

                    // End doesn't matter for Fitbit wearing
                    // Removing it means we are consider a time window up to this point
                    // end:{
                    //     // reference:
                    //     // now: current time
                    //     // today: end of today (23:59:59 pm)
                    //     reference: "today",

                    //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                    //     // Plus 0 hours basically means using the reference point directly
                    //     offset: {type: "minus", value: {days: 6}}
                    // }
                }
            }
        },
        
    ]
};

// checkOneConditionForUser(condition, userInfo, dateTime)




//let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());

let checkResultList = [];

for (let i = 0; i < userInfoList.length; i++) {
    let userInfo = userInfoList[i];
    let testDate = DateTime.fromFormat("11/28/2022, 12:00:00 PM", "F", { zone: userInfo.timezone });
    let checkResult = await TaskExecutor.isPreConditionMetForUser(sampleConditionObj, userInfo, testDate);

    checkResultList.push(checkResult);
}

for (let i = 0; i < userInfoList.length; i++) {
    let userInfo = userInfoList[i];
    let checkResult = checkResultList[i];

    console.log(`[Test] for ${userInfo.username}: result: ${checkResult}`);

}