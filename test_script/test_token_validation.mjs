import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import FitbitHelper from "../lib/FitbitHelper.mjs";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const users = await prisma.users.findMany();

// Step 1: test token introspect first

// try only one
/*
let userInfo = users[1];

let introspectTokenResult = await FitbitHelper.myIntrospectToken(userInfo.accessToken, userInfo.accessToken);
console.log(`introspectTokenResult: ${JSON.stringify(introspectTokenResult, null, 2)}`);
*/

let introspectTokenResultList = [];
let userInfo;



//  try all
/*
for(let i = 0; i < users.length; i++){
    userInfo = users[i];
    let result = await FitbitHelper.myIntrospectToken(userInfo.accessToken, userInfo.accessToken);
    introspectTokenResultList.push(result);
}

console.log(`introspectTokenResultList: ${JSON.stringify(introspectTokenResultList, null, 2)}`);
*/



// test toekn refresh second
// try refresh the second one
userInfo = users[1];

let refreshUpdateResult = await DatabaseUtility.refreshAndUpdateTokenForUser(userInfo);
console.log(`refreshUpdateResult: ${JSON.stringify(refreshUpdateResult, null, 2)}`);




// test ensure token valid third


