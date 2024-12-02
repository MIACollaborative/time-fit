import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

let userList = await prisma.users.findFirst({
    where: {
        username: {
          contains: "test1",
        },
      },
});


let theUser = userList[0];

console.log(JSON.stringify(theUser, null, 2));



const dateGoalList = await DatabaseUtility.getUserFitbitDailyDateAndGoalDuringPeriodById(theUser.fitbitId, "2024-11-27", "2024-12-02", "steps", 3);

console.log(JSON.stringify(dateGoalList));
