import prisma from "../../lib/prisma";

/*
import pkg from 'luxon';
const {DataTime} = pkg;
*/

import { DateTime } from "luxon";

function replacer(key, value) {
    if (typeof value === "Date") {
      return value.toString();
    }
    return value;
  }

export default async function handler(req, res) {
    const { function_name } = req.query;
    

    console.log(`cron - function: ${function_name}`);

    let now = DateTime.now();
    // .toLocaleString(DateTime.TIME_SIMPLE);

    switch (function_name) {
        case "check_user_weekday_wakeup_time":
            
            const users = await prisma.users.findMany({
                /*
                where: {
                    weekdayWakeup: {
                        gte: new Date("2020-01-01"),
                        lt:  new Date("2020-01-02")
                    },
                },
                */
                select: {
                    username: true,
                    weekdayWakeup: true,
                },
            });

            let userList = JSON.parse(JSON.stringify(users, replacer));
            
            res.status(200).json({ result: userList });
            return;
        default:
            return;
    }
}
