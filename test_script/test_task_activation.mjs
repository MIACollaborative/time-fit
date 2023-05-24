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


let userList = await prisma.users.findMany({

    where: {
        username: {
          contains: "participant11",
        },
    },
});

let userInfoList = JSON.parse(JSON.stringify(userList, replacer));

let oneUser = userInfoList[0];

// 2022.08.31 02:00 PM (EDT)
//let dateTime = DateTime.fromJSDate(new Date(2022, 7, 31, 14, 0, 0));

// let's create one task that has all the conditions

let taskList = GeneralUtility.taskList.filter((taskInfo) => {
    return taskInfo.label == "fitbit generate manual update";
});

let resultList = [];

for(let i = 0; i < taskList.length; i++){
    let oneTask = taskList[i];

    //let startDate = DateTime.fromFormat("03/13/2023, 08:00:00 AM", "F", { zone: "America/Detroit" });

    // 2023-03-22T12:30:01.248Z
    let startDate = DateTime.fromISO("2023-05-24T04:59:00.059Z");
    
    // now, go through a week
    for(let j = 0; j <=5; j++){
        let curDate = startDate.plus({minutes: j});
        console.log(`[${curDate}] --------------------------------------------------------------\n\n`);

        // let result = await TaskExecutor.executeTaskForUserListForDatetime(oneTask, [oneUser], curDate);
        
        let isTimeZoneSetResult =  GeneralUtility.isTimezoneSet(oneUser);
        let [isGroupResult, groupEvaluationRecordList] = TaskExecutor.isGroupForUser(oneTask.group, oneUser);
        let [isCheckPointResult, checkPointEvaluationRecordList] = TaskExecutor.isCheckPointForUser(oneTask.checkPoint, oneUser, curDate);

        console.log(`------------------\n\n`);

        console.log(`[${curDate}] isTimeZoneSetResult: ${isTimeZoneSetResult}\n\n`);
        console.log(`[${curDate}] isGroupResult: ${isGroupResult}\n\n`);
        console.log(`[${curDate}] isCheckPointResult: ${isCheckPointResult}\n\n`);

        console.log(`--------------------------------------------------------------\n\n`);

        resultList.push({date: curDate, result: isTimeZoneSetResult && isGroupResult &&  isCheckPointResult});
    }

    
}

console.log(`\n\n--------------------------------------------------------------\n\n`);

for(let i = 0; i < resultList.length; i++){
    let resultInfo = resultList[i];
    console.log(`[${resultInfo.date}] result: ${resultInfo.result}\n\n`);
}
