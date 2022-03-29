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
    
    let now = DateTime.now();
    let pingTimeUTC = now.toUTC();
    // .toLocaleString(DateTime.TIME_SIMPLE);
    let pingTimeLocal = now.toLocaleString(DateTime.TIME_WITH_SECONDS);
    console.log(`cron UTC: ${pingTimeUTC} - function: ${function_name}`);
    console.log(`url: ${process.env.NEXTAUTH_URL}`);

    async function sendTwilioMessage(phone, messageBody) {
        console.log(`Main.sendTwilioMessage: ${phone} - ${messageBody}`);
        const result = await fetch(`http://localhost:3000/api/twilio?function_name=send_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            messageBody
          }),
        }).then((r) => {
          return r.json();
        });
    
        return result;
    }
    


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
                    phone: true,
                    preferredName: true,
                    weekdayWakeup: true,
                },
            });

            let userList = JSON.parse(JSON.stringify(users, replacer));

            userList = userList.map((userInfo) => {
                let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);

                let localWeekdayWakeupUTC = DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({year: pingTimeUTC.year, month: pingTimeUTC.month, day: pingTimeUTC.day, second: pingTimeUTC.second, millisecond: pingTimeUTC.millisecond});



                return {...userInfo, localWeekdayWakeup, localWeekdayWakeupUTC, pingTimeLocal, pingTimeUTC};
            })
            .filter((newUserInfo) => {
                let diffInMins = newUserInfo.pingTimeUTC.diff(newUserInfo.localWeekdayWakeupUTC, 'minutes');
                console.log(`pingTimeUTC: ${newUserInfo.pingTimeUTC}, localWeekdayWakeupUTC: ${newUserInfo.localWeekdayWakeupUTC}, diffInMins: ${diffInMins.toObject().minutes}`);
                
                return diffInMins.toObject().minutes == 0;
                //return newUserInfo.localWeekdayWakeupUTC == newUserInfo.pingTimeUTC;
                
            });

            // those who pass should get the wake up message
            userList.forEach((userInfo) => {
                console.log(`userInfo: ${JSON.stringify(userInfo)}`);
                //let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);
                // sendTwilioMessage(userInfo.phone, `Hello ${userInfo.preferredName}`);
                sendTwilioMessage(userInfo.phone, `[WalkToJoy] Hello ${userInfo.preferredName},\n It's your wake up time: ${userInfo.localWeekdayWakeup}. Here is a random survey for you: https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=XYZ`);
            });



            
            res.status(200).json({ result: userList });
            return;
        default:
            return;
    }
}
