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


// 2022.08.31 02:00 PM (EDT)
let dateTime = DateTime.fromJSDate(new Date(2022, 7, 31, 14, 0, 0));

let condition = {
    // surveyFilledByThisPerson -> check whether a survey response is received within a time window
    type: "hasFitbitUpdateForPersonByDateRange",
    criteria: {
        period: {
            // Start: the start of the day for that day (e.g., 00:00 am on 08/31)
            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
            start:{
                // reference: currently only support "today" as the basis
                reference: "today", 

                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                // Plus 0 days basically means using the reference point directly
                offset: {type: "minus", value: {days: 0}}
            },

            // End: the start of the day for that day (e.g., 23:59 pm on 08/31)
            // Removing it means we are consider the end of today
            end:{
                // reference: currently only support "today" as the basis
                reference: "today", 

                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                // Plus 0 days basically means using the reference point directly
                offset: {type: "minus", value: {days: 0}}
            }
        }
    }
};

let result = await TaskExecutor.checkOneConditionForUser(condition, user, dateTime);

console.log(`result: ${JSON.stringify(result, null, 2)}`);
