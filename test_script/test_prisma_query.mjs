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

let updateList = await prisma.fitbit_update.findMany({
    where:{
        status: "notification"
    },
    take: 5,
    orderBy: {
        createdAt: 'desc',
    },
})


console.log(`updateList: ${JSON.stringify(updateList)}`);

console.log(`updateList[0].createdAt: ${updateList[0].createdAt}`);
console.log(`typeof updateList[0].createdAt: ${typeof updateList[0].createdAt}`);
