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

let taskLogFailedList = await prisma.taskLog.findMany({
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


let taskLogFailedBecuaseTokenList = taskLogFailedList.filter((taskLog) => {
    return v.includes(taskLog.executionResult.value.errorMessage, "Refresh token invalid");
});

console.log(
    `taskLogFailedBecuaseTokenList.length: ${taskLogFailedList.length}`
);

let failedTokenListList = taskLogFailedList.map((taskLog) => {
    let errorLogStringList = v.replaceAll(v.replaceAll(taskLog.executionResult.value.errorMessage, "\n", ""), "'", "\"").split("-");

    let tokenList = errorLogStringList.filter((errorString) => {return errorString.length > 5;}).map((errorString) => {
        let tokenIndexStart = errorString.indexOf("Refresh token invalid: ") + "Refresh token invalid: ".length;
        let tokenIndexEnd = errorString.indexOf(". Visit https")  - 1;

        return v.substring(errorString, tokenIndexStart, tokenIndexEnd);

    });

    let errorTokenWithCreatedAtList = tokenList.map((token) => {
        return {token, createdAt: taskLog.createdAt};
    });

    return errorTokenWithCreatedAtList;
});

let failedTokenInfoList = [];

failedTokenListList.forEach((tokenList) => {
    failedTokenInfoList.push(...tokenList);
});


// ok, now, go find the user..... LOG

let refrehTokenUserMap = {};

let setTokenList = [];

failedTokenListList.forEach((tokenInfo) => {
    let token = tokenInfo.token;

    if(!setTokenList.includes(token)){
        setTokenList.push(token);
    }
});

for(let i = 0; i < setTokenList.length;i++){
    let token = setTokenList[i];

    // now, get the user
    let result = await prisma.users.findFirst({
        where: { refreshToken: token }
    });

    if(result != undefined){
        let username = result.username;
        refrehTokenUserMap[token] = result;
    }
}

console.log(`refrehTokenUserMap: ${JSON.stringify(refrehTokenUserMap)}`);

return;

// now, dump the token?
failedTokenInfoList = failedTokenInfoList.map((tokenInfo) => {
    let userInfo = refrehTokenUserMap[tokenInfo.token];
    return {
        username: userInfo.username,
        fitbitId: userInfo.fitbitId,
        ...tokenInfo,
    };
});


console.log(
    `failedTokenInfoList: ${JSON.stringify(failedTokenInfoList, null, 2)}`
  );
  


