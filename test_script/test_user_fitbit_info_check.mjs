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


// insert the fake subscription first
//const deleteSubs = await prisma.fitbit_subscription.deleteMany({});

let userList = await prisma.users.findMany();

console.log(`users: ${JSON.stringify(userList)}`);

userList = userList.filter((userInfo) => {
    return GeneralUtility.doesFitbitInfoExist(userInfo);
});




console.log(`users with fitbit info: ${JSON.stringify(userList)}`);
