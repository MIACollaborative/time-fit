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

let userInfo = await prisma.users.findFirst({
    where: {
        username: "test2"
    }
});

userInfo = JSON.parse(JSON.stringify(userInfo, replacer));


let referenceDateStr = "today";


let sampleCondition = {
    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate", // This type can only check the specified date inside the start: {}
    opposite: false, // participant did adhere to wearing fitbit for +8 hours
    criteria: {
        idList: [""],

        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
        // Use ("not any") for checking survey NOT filled, etc.
        idRelationship: "and",

        // check whether minutes >= wearingLowerBoundMinutes
        wearingLowerBoundMinutes: 60 * 8,

        period: {
            // Start: the starting piont of the time window to consider
            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
            start: {
                reference: "today",
                offset: { type: "minus", value: { days: 1 } } // checks for wearing adherence 1 days ago (only that day)
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
};

// checkOneConditionForUser(condition, userInfo, dateTime)


let testDate = DateTime.fromFormat("10/25/2022, 08:00:00 AM", "F", { zone: userInfo.timezone });

//let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());

let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, testDate);

console.log(`checkOneConditionForUser: ${result}`);