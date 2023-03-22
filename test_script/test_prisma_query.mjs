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
        username: "test2",
        taskLabel: "intervention_morning gif",
        createdAt: daysConstraint
    },
    /*
    take: 5,
    orderBy: {
        createdAt: 'desc',
    },
    */
});

console.log(`taskLogList: ${JSON.stringify(sampleList)}`);


/*


let fUpdate = sampleList[0];
console.log(`fUpdate: ${fUpdate}`);

let timeString = "2022-11-08T17:01:56.214Z";
console.log(`timeString: ${timeString}`);
let timestamp = DateTime.fromISO(timeString).toJSDate();
console.log(`timestamp: ${timestamp}`);

const updateList = await prisma.fitbit_update.findMany({
    where: {
        //status: "notification",
        ownerId: fUpdate.ownerId,
        collectionType: fUpdate.collectionType,
        date: fUpdate.date,
        createdAt: {
            lte: timestamp //fUpdate.createdAt
        },
    },
});

console.log(`updateList: ${JSON.stringify(updateList.map((update) => {return update.createdAt;}))}`);
*/
