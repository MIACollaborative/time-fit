import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let userList = await prisma.users.findMany({
    where: {
        username: {
          is: "test1",
        },
      },
});


let theUser = userList[0];

console.log(JSON.stringify(theUser, null, 2));



const dateGoalList = await DatabaseUtility.getUserFitbitDailyDateAndGoalDuringPeriodById(theUser.fitbitId, "2024-11-27", "2024-12-02", "steps", 3);

console.log(JSON.stringify(dateGoalList));
