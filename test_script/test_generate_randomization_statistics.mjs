import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}


let taskLogList = await await prisma.taskLog.groupBy({
    by: ['taskLabel'],
    where: {
        Not: {
            randomizationResult: {
                path: ['chance'],
                equals: 1.0
            }
        }
        
    },
    _sum: {
      profileViews: true,
    },
    having: {
      profileViews: {
        _min: {
          gte: 10,
        },
      },
    },
  })

let taskLogInfoList = JSON.parse(JSON.stringify(taskLogList, replacer));



let testDate = DateTime.fromFormat("11/30/2022, 09:00:00 AM", "F", { zone: "America/Detroit" });

console.log(`result: ${JSON.stringify(result, null, 2)}`);
