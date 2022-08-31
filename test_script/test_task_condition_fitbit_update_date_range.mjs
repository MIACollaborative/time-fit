import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const user = await prisma.users.findFirst({
    where:{
        username: "test1"
    }
})


let dateTime = DateTime.fromJSDate(new Date(2022, 7, 31, 14, 0, 0));

let condition = {
    // surveyFilledByThisPerson -> check whether a survey response is received within a time window
    type: "hasFitbitUpdateForPersonByDateRange",
    criteria: {
        period: {
            // Start: the starting piont of the time window to consider
            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
            start:{
                // reference: currently only support "now" as the basis
                reference: "today", 

                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                // Plus 0 hours basically means using the reference point directly
                offset: {type: "minus", value: {days: 6}}
            },

            // End: the end point of the time window to consider
            // Removing it means we are consider a time window up to this point
            end:{
                // reference: currently only support "now" as the basis
                reference: "today", 

                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                // Plus 0 hours basically means using the reference point directly
                offset: {type: "minus", value: {days: 6}}
            }
        }
    }
};

let result = await TaskExecutor.checkOneConditionForUser(condition, user, dateTime);

console.log(`result: ${JSON.stringify(result, null, 2)}`);
