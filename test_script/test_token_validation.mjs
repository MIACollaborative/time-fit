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

// try only one
let userInfo = users[0];

let introspectTokenResult = FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);

console.log(`introspectTokenResult: ${JSON.stringify(introspectTokenResult, null, 2)}`);

/*
let introspectTokenResultList = users.map((userInfo) => {
    return FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);
});

console.log(`introspectTokenResultList: ${JSON.stringify(introspectTokenResultList, null, 2)}`);

*/
// test token introspect first


// test toekn refresh second

// test ensure token valid third


