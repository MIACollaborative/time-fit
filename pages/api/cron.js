import prisma from "../../lib/prisma";
import { DateTime } from "luxon";
import TaskExecutor from "../../lib/TaskExecutor.mjs";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

function getLocalTime(datetime, timezone) {
    return datetime.setZone(timezone);
}

function getWeekdayOrWeekend(datetime) {
    console.log(`getWeekdayOrWeekend: ${datetime.weekday}`);
    if (datetime.weekday < 6) {
        return "weekday";
    }
    else {
        return "weekend";
    }
}

async function executeTask(now) {
    let users = await prisma.users.findMany({
        select: {
            username: true,
            phone: true,
            preferredName: true,
            gif: true,
            salience: true,
            modification: true,
            weekdayWakeup: true,
            weekdayBed: true,
            weekendWakeup: true,
            weekendBed: true,
            timezone: true
        },
    });

    let userList = JSON.parse(JSON.stringify(users, replacer));

    let tasks = await prisma.task.findMany({
        where: { enabled: true}
    });

    let taskList = JSON.parse(JSON.stringify(tasks, replacer));
    console.log(`taskList.length: ${taskList.length}`);


    let taskCompositeResultList = [];

    let aTaskResultList = await TaskExecutor.executeTaskForUserListForDatetime(taskList[0], userList, now);
    console.log(`aTaskResultList: ${JSON.stringify(aTaskResultList)}`);
    taskCompositeResultList = taskCompositeResultList.concat(aTaskResultList);


    /*
    let resultPromiseList = taskList.forEach((task) => {
        let aTaskResultList = await TaskExecutor.executeTaskForUserListForDatetime(task, userList, now);
        taskCompositeResultList = taskCompositeResultList.concat(aTaskResultList);
    });
    */


    /*
    await Promise.all(resultPromiseList)
    .then((resultListList) => {
        resultListList.forEach((aTaskResultList) => {
            taskCompositeResultList.concat(aTaskResultList);
        });
        return taskCompositeResultList;
    });
    */

    console.log(`taskCompositeResultList: ${JSON.stringify(taskCompositeResultList)}`);

    let insertResult = [];

    if(taskCompositeResultList.length > 0){
        insertResult = await prisma.taskLog.createMany({
            data: taskCompositeResultList
        });
    }
    console.log(`insertResult: ${JSON.stringify(insertResult)}`);

    return;

}

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



export default async function handler(req, res) {
    const { function_name } = req.query;

    let now = DateTime.now(); //.plus({day: 2}); // DateTime.now();


    switch (function_name) {
        case "execute_task":
            let resultList = executeTask(now);
            res.status(200).json({ result: "success" });
            break;
        default:
            break;
    }

    return;
}


async function testWakeupBedTime(now) {
    let pingTimeUTC = now.toUTC();
    // .toLocaleString(DateTime.TIME_SIMPLE);
    let pingTimeLocal = now.toLocaleString(DateTime.TIME_WITH_SECONDS);
    console.log(`cron UTC: ${pingTimeUTC} - function: ${function_name}`);

    let tempTimezone = "Asia/Taipei"; // "America/New_York";
    console.log(`Local time for ${tempTimezone} is ${getLocalTime(now, tempTimezone)} [${getWeekdayOrWeekend(getLocalTime(now, tempTimezone))}]`);
    //console.log(`url: ${process.env.NEXTAUTH_URL}`);

    // see if I can detect weekday and weekend for a particular timezone, then

    switch (function_name) {
        case "check_user_weekday_wakeup_time":
            userList = userList.map((userInfo) => {
                let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_SIMPLE);

                let localWeekdayWakeupUTC = DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({ year: pingTimeUTC.year, month: pingTimeUTC.month, day: pingTimeUTC.day, second: pingTimeUTC.second, millisecond: pingTimeUTC.millisecond });

                // var overrideZone = DateTime.fromISO("2017-05-15T09:10:23", { zone: "Europe/Paris" });
                let rezoned = DateTime.fromISO(userInfo.weekdayWakeup).setZone(userInfo.timezone);
                let timezonedTime = rezoned.toLocaleString(DateTime.TIME_SIMPLE);



                return { ...userInfo, localWeekdayWakeup, localWeekdayWakeupUTC, weekdayWakeupTimezonedTime: timezonedTime, pingTimeLocal, pingTimeUTC };
            })
                .filter((newUserInfo) => {
                    let diffInMins = newUserInfo.pingTimeUTC.diff(newUserInfo.localWeekdayWakeupUTC, 'minutes');


                    console.log(`[${newUserInfo.username}]\t-pingTimeUTC: ${newUserInfo.pingTimeUTC}, localWeekdayWakeupUTC: ${newUserInfo.localWeekdayWakeupUTC}, timezonedTime: ${newUserInfo.weekdayWakeupTimezonedTime}, diffInMins: ${diffInMins.toObject().minutes}`);

                    return diffInMins.toObject().minutes == 0;
                    //return newUserInfo.localWeekdayWakeupUTC == newUserInfo.pingTimeUTC;

                });

            // those who pass should get the wake up message
            userList.forEach((userInfo) => {
                //let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);
                // sendTwilioMessage(userInfo.phone, `Hello ${userInfo.preferredName}`);
                let messageBody = `[WalkToJoy] Hello ${userInfo.preferredName},\n It's your wake up time: ${userInfo.weekdayWakeupTimezonedTime}. Here is a random survey for you: https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=${userInfo.username}`;

                console.log(`[On time] userInfo: ${JSON.stringify(userInfo)}\n Message: ${messageBody}`);

                sendTwilioMessage(userInfo.phone, messageBody);
            });
            res.status(200).json({ result: userList });
            return;
        case "check_user_weekday_bed_time":
            userList = userList.map((userInfo) => {
                let localWeekdayBed = DateTime.fromISO(userInfo.weekdayBed).toLocaleString(DateTime.TIME_SIMPLE);

                let localWeekdayBedUTC = DateTime.fromISO(userInfo.weekdayBed).toUTC().set({ year: pingTimeUTC.year, month: pingTimeUTC.month, day: pingTimeUTC.day, second: pingTimeUTC.second, millisecond: pingTimeUTC.millisecond });

                // var overrideZone = DateTime.fromISO("2017-05-15T09:10:23", { zone: "Europe/Paris" });
                let rezoned = DateTime.fromISO(userInfo.weekdayBed).setZone(userInfo.timezone);
                let timezonedTime = rezoned.toLocaleString(DateTime.TIME_SIMPLE);


                return { ...userInfo, localWeekdayBed, localWeekdayBedUTC, weekdayBedTimezonedTime: timezonedTime, pingTimeLocal, pingTimeUTC };
            })
                .filter((newUserInfo) => {
                    let diffInMins = newUserInfo.pingTimeUTC.diff(newUserInfo.localWeekdayBedUTC, 'minutes');


                    console.log(`[${newUserInfo.username}]\t-pingTimeUTC: ${newUserInfo.pingTimeUTC}, localWeekdayBedUTC: ${newUserInfo.localWeekdayBedUTC}, timezonedTime: ${newUserInfo.weekdayBedTimezonedTime}, diffInMins: ${diffInMins.toObject().minutes}`);

                    return diffInMins.toObject().minutes == 0;
                    //return newUserInfo.localWeekdayWakeupUTC == newUserInfo.pingTimeUTC;

                });

            // those who pass should get the wake up message
            userList.forEach((userInfo) => {

                //let localWeekdayWakeup = DateTime.fromISO(userInfo.weekdayWakeup).toLocaleString(DateTime.TIME_WITH_SECONDS);
                // sendTwilioMessage(userInfo.phone, `Hello ${userInfo.preferredName}`);
                let messageBody = `[WalkToJoy] Hello ${userInfo.preferredName},\n It's your bed time: ${userInfo.weekdayBedTimezonedTime}. Here is a random survey for you: https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=${userInfo.username}`;

                console.log(`[On time] userInfo: ${JSON.stringify(userInfo)}\n Message: ${messageBody}`);

                sendTwilioMessage(userInfo.phone, messageBody);
            });
            res.status(200).json({ result: userList });
            return;
        default:
            return;
    }

}
