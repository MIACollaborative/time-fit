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

// version 1

const taskWithLogList = await prisma.task.findMany({
    include: {
        taskLogList: true
    },
})

// advance
// ok, the path feature might not be supported by MongoDB
/*
let taskLogList = await await prisma.taskLog.groupBy({
    by: ['taskLabel'],
    where: {
        NOT: {
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
*/

let taskWithLogInfoList = JSON.parse(JSON.stringify(taskWithLogList, replacer));

//let testDate = DateTime.fromFormat("11/30/2022, 09:00:00 AM", "F", { zone: "America/Detroit" });

console.log(`result[0]: ${JSON.stringify(taskWithLogInfoList[0], null, 2)}`);
