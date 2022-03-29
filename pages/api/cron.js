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
    //console.log(`url: ${process.env.NEXTAUTH_URL}`);

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
    
    const users = await prisma.users.findMany({
        select: {
            username: true,
            phone: true,
            preferredName: true,
            weekdayWakeup: true,
            weekdayBed: true,
        },
    });

    let userList = JSON.parse(JSON.stringify(users, replacer));


    switch (function_name) {
        case "check_user_weekday_wakeup_time":
            userList = userList.map((userInfo) => {
                let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_SIMPLE);

                let localWeekdayWakeupUTC = DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({year: pingTimeUTC.year, month: pingTimeUTC.month, day: pingTimeUTC.day, second: pingTimeUTC.second, millisecond: pingTimeUTC.millisecond});



                return {...userInfo, localWeekdayWakeup, localWeekdayWakeupUTC, pingTimeLocal, pingTimeUTC};
            })
            .filter((newUserInfo) => {
                let diffInMins = newUserInfo.pingTimeUTC.diff(newUserInfo.localWeekdayWakeupUTC, 'minutes');
                console.log(`[${newUserInfo.username}]\t-pingTimeUTC: ${newUserInfo.pingTimeUTC}, localWeekdayWakeupUTC: ${newUserInfo.localWeekdayWakeupUTC}, diffInMins: ${diffInMins.toObject().minutes}`);
                
                return diffInMins.toObject().minutes == 0;
                //return newUserInfo.localWeekdayWakeupUTC == newUserInfo.pingTimeUTC;
                
            });

            // those who pass should get the wake up message
            userList.forEach((userInfo) => {
                //let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);
                // sendTwilioMessage(userInfo.phone, `Hello ${userInfo.preferredName}`);
                let messageBody = `[WalkToJoy] Hello ${userInfo.preferredName},\n It's your wake up time: ${userInfo.localWeekdayWakeup}. Here is a random survey for you: https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=${userInfo.username}`;

                console.log(`[On time] userInfo: ${JSON.stringify(userInfo)}\n Message: ${messageBody}`);

                sendTwilioMessage(userInfo.phone, messageBody);
            });
            res.status(200).json({ result: userList });
            return;
        case "check_user_weekday_bed_time":
            userList = userList.map((userInfo) => {
                let localWeekdayBed= DateTime.fromISO(userInfo.weekdayBed).toLocaleString(DateTime.TIME_SIMPLE);

                let localWeekdayBedUTC = DateTime.fromISO(userInfo.weekdayBed).toUTC().set({year: pingTimeUTC.year, month: pingTimeUTC.month, day: pingTimeUTC.day, second: pingTimeUTC.second, millisecond: pingTimeUTC.millisecond});



                return {...userInfo, localWeekdayBed, localWeekdayBedUTC, pingTimeLocal, pingTimeUTC};
            })
            .filter((newUserInfo) => {
                let diffInMins = newUserInfo.pingTimeUTC.diff(newUserInfo.localWeekdayBedUTC, 'minutes');
                console.log(`[${newUserInfo.username}]\t-pingTimeUTC: ${newUserInfo.pingTimeUTC}, localWeekdayBedUTC: ${newUserInfo.localWeekdayBedUTC}, diffInMins: ${diffInMins.toObject().minutes}`);
                
                return diffInMins.toObject().minutes == 0;
                //return newUserInfo.localWeekdayWakeupUTC == newUserInfo.pingTimeUTC;
                
            });

            // those who pass should get the wake up message
            userList.forEach((userInfo) => {
                
                //let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);
                // sendTwilioMessage(userInfo.phone, `Hello ${userInfo.preferredName}`);
                let messageBody = `[WalkToJoy] Hello ${userInfo.preferredName},\n It's your bed time: ${userInfo.localWeekdayBed}. Here is a random survey for you: https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=${userInfo.username}`;

                console.log(`[On time] userInfo: ${JSON.stringify(userInfo)}\n Message: ${messageBody}`);

                sendTwilioMessage(userInfo.phone, messageBody);
            });
            res.status(200).json({ result: userList });
            return;
        default:
            return;
    }
}
