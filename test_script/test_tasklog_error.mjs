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

const taskLogFailedList = await prisma.taskLog.findMany({
  where: {
    taskLabel: "fitbit process notification",
    executionResult: {
      equals: {
        type: "fitbit-process-update",
        /*
        value: {
            equals: {
            status: "failed",
          },
        },
        */
      },
    },
  },
});

let failedActionResultList = taskLogFailedList.map((taskLog) => {
  return JSON.parse(
    v.replaceAll(taskLog.executionResult.value.errorMessage, "\n", "")
  );
});

console.log(
  `failedActionResultList: ${JSON.stringify(failedActionResultList, null, 2)}`
);
