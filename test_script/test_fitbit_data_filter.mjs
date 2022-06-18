import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let fitbitRecordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById("4SW9W9", "2022-06-06", "2022-06-12");


console.log(`fitbitRecordList: ${JSON.stringify(fitbitRecordList, null, 2)}`);
console.log(`fitbitRecordList.length: ${fitbitRecordList.length}`);


let average = await DatabaseUtility.getUserFitbitAverageDailyStepsDuringPeriodById("4SW9W9", "2022-06-06", "2022-06-12");


console.log(`average: ${average}`);

