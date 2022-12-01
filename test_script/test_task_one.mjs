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
          contains: "test1",
        },
      },
});

let userInfoList = JSON.parse(JSON.stringify(userList, replacer));


/*
const user = await prisma.users.findFirst({
    where:{
        username: "test1"
    }
})

let userInfo = JSON.parse(JSON.stringify(user, replacer));
*/

// 2022.08.31 02:00 PM (EDT)
//let dateTime = DateTime.fromJSDate(new Date(2022, 7, 31, 14, 0, 0));

// let's create one task that has all the conditions

let taskList = GeneralUtility.taskList.filter((taskInfo) => {
    return taskInfo.label == "fitbit process notification";
});


for(let i = 0; i < taskList.length; i++){
    let oneTask = taskList[i];
    let testDate = DateTime.fromFormat("11/30/2022, 09:00:00 AM", "F", { zone: "America/Detroit" });
    let result = await TaskExecutor.executeTaskForUserListForDatetime(oneTask, [GeneralUtility.systemUser], testDate);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
}

