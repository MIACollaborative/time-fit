import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";
//import { DateTime } from "luxon";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let nowDate = DateTime.now();
let startDate = nowDate.minus({weeks: 2}).startOf("day");
let daysConstraint = {
  gte: startDate.toISO(),
  lte: nowDate.toISO()
};


let sampleList = await prisma.taskLog.findMany({
    where:{
        type: "twilio",
    }
});

console.log(`twilioList: ${JSON.stringify(sampleList[0], null, 2)}`);