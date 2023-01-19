import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let theAction = {
    type: "processFitbitUpdate",

    prioritizeSystemUpdate: true, 

    favorRecent: true

};

let updateType = "processed";

let recentUpdateList = await DatabaseUtility.getFitbitUpdateByStatusWithLimit(updateType, 1, theAction.prioritizeSystemUpdate, theAction.favorRecent);

console.log(`recentUpdateList: ${JSON.stringify(recentUpdateList, null, 2)}`);
console.log(`recentUpdateList.length: ${recentUpdateList.length}`);


// try to find the taskLog for the past 4 mins
/*
let nowDateTime = DateTime.now();
let beforeDateTime = nowDateTime.minus({minutes: 4});


let recentTaskLogList = await DatabaseUtility.findTaskLogWithActionTypeDuringPeriod("processFitbitUpdate", beforeDateTime, nowDateTime, 1);

// next, filterd by those whose 
let recentTagLogWithResultList = recentTaskLogList.filter((taskLog) => {
    return taskLog.executionResult.value.body.length > 0
});


// now, extract the Fitbit ID
let recentFitbitIdWithUpdateProcessed = [];

recentTagLogWithResultList.forEach((taskLog) => {
    taskLog.executionResult.value.body.forEach((fitbitUpdateLog) => {
        let fitbitId = fitbitUpdateLog["ownerId"];
        if(!recentFitbitIdWithUpdateProcessed.includes(fitbitId)){
            recentFitbitIdWithUpdateProcessed.push(fitbitId);
        }
    });
});

// now, the list have all the recent updates Fitbit Ids in 4 mins

// ok, so now, filter the update list if they are about these ID
recentUpdateList = recentUpdateList.filter((updateInfo)=> {
    return !recentFitbitIdWithUpdateProcessed.includes(updateInfo.ownerId);
});

console.log(`recentUpdateList without recent procssing: ${JSON.stringify(recentUpdateList, null, 2)}`);
console.log(`recentUpdateList without recent procssing.length: ${filteredUpdateList.length}`);
*/

let filteredUpdateList = await GeneralUtility.removeFitbitUpdateDuplicate(recentUpdateList, false);

console.log(`filteredUpdateList: ${JSON.stringify(filteredUpdateList, null, 2)}`);
console.log(`filteredUpdateList.length: ${filteredUpdateList.length}`);

// now, for each update, retrieve accordingly

/*
let resultList =  filteredUpdateList.map((fitbitUpdate) => {
    return await 
});
*/