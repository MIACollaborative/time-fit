import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let surveyId = "SV_cACIS909SMXMUp8";
let startDate = DateTime().froomISO("2022-06-18T00:00:00.000Z");
let endDate = DateTime.froomISO("2022-06-19T00:00:00.000Z");

let surveyRecordList = await DatabaseUtility.findSurveyResponoseDuringPeriod(surveyId, startDate, endDate);

console.log(`surveyRecordList: ${JSON.stringify(surveyRecordList, null, 2)}`);
console.log(`surveyRecordList.length: ${surveyRecordList.length}`);

