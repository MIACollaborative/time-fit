import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let userList = await prisma.users.findMany({
    where: {
        username: {
          contains: "test1",
        },
      },
});


let theUser = userList[0];

console.log(JSON.stringify(theUser, null, 2));



const dateGoalList = await DatabaseUtility.getUserFitbitDailyGoalAndWearingMinutesDuringPeriodById(theUser.fitbitId, "2024-11-27", "2024-12-02", "steps");

console.log("dateGoalList" + JSON.stringify(dateGoalList));


const wearingDateGoalList = await DatabaseUtility.getUserFitbitDailyGoalsForWearingDaysDuringPeriodById(theUser.fitbitId, "2024-11-27", "2024-12-02", "steps", 60 * 8, 3);

console.log("wearingDateGoalList" + JSON.stringify(wearingDateGoalList));