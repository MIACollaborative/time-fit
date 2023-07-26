import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import v from "voca";
//import { DateTime } from "luxon";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let username = "test1";

// this gives you the number of taskLog that associated with this particular user.
let endDateString = DateTime.now().toISO();
let startDateString = DateTime.now().minus({days: 7}).toISO();

const taskLogFailedList = await prisma.taskLog.findMany({
  where: {
    taskLabel: "fitbit process notification",
    createdAt: {
        gte: startDateString,
        lte: endDateString
    }
  },
});

taskLogFailedList = taskLogFailedList.filter((taskLog) => {
    return taskLog.executionResult.value.status == "failed";
});

console.log(
    `taskLogFailedList.length: ${taskLogFailedList.length}`
  );

let failedActionResultList = taskLogFailedList.map((taskLog) => {
  return JSON.parse(
    v.replaceAll(taskLog.executionResult.value.errorMessage, "\n", "")
  );
});

console.log(
  `failedActionResultList: ${JSON.stringify(failedActionResultList, null, 2)}`
);
