import nodeCron from "node-cron";
import { DateTime } from "luxon";
import TaskExecutor from "./TaskExecutor.mjs";
import DatabaseHelper from "../utility/DatabaseHelper.mjs";
import * as dotenv from "dotenv";

let expressionLabelDict = {
  "1 minute": {
    label: "every 1 minute",
    expression: "* * * * *",
  },
  "10 seconds": {
    label: "every 10 seconds",
    expression: "*/10 * * * * *",
  },
};

let theExpression = expressionLabelDict["1 minute"];

let lastDate = undefined;

export default class TimeEngine {
  static scheduler = undefined;
  static systemUser = {
    username: "system-user",
    preferredName: "System User",
    phone: "",
    timezone: "America/Detroit",

    // might not matter
    phase: "intervention",
  };

  constructor() {
    TimeEngine.start();
  }

  static async start() {
    scheduler = nodeCron.schedule(
      theExpression.expression,
      async () => {
        const cronTime = process.hrtime();
        const now = DateTime.now().toJSDate();
        console.log(
          `execute cron event generation task ${theExpression.label} at ${now}`
        );
        const t1 = process.hrtime();

        // for testing: 2022-09-19 08:00 PM 000 milliseconds
        //let now = new Date(2023, 5, 16, 10, 0, 1); //EDT/EST

        // for real
        //let now = DateTime.now().toJSDate();

        // ensure that the lasteDate is not the same as now at the minute level
        //console.log(`lasteDate (before): ${lastDate}`);

        if (lastDate !== undefined) {
          const lastDateMinute = DateTime.fromJSDate(lastDate)
            .startOf("minute")
            .toJSDate();
          const nowMinute = DateTime.fromJSDate(now)
            .startOf("minute")
            .toJSDate();

          if (lastDateMinute.getTime() !== nowMinute.getTime()) {
            await postClockEvent(now);
          } else {
            // Skipping event generation as lastDate and now are the same at the minute level
            /*
            console.log(
              `${DateTime.fromJSDate(
                now
              ).toISO()}: Skipping event generation as lastDate and now are the same at the minute level`
            );
            */
          }
        } else {
          await postClockEvent(now);
        }

        lastDate = now;
        //console.log(`lasteDate (after): ${lastDate}`);

        const t2 = process.hrtime(t1);
        console.log("did tick in", t2[0] * 1000 + t2[1] / 100000, "ms");
      },
      { recoverMissedExecutions: true }
    );
  }

  static async stop() {
    this.scheduler.stop();
  }

  static async executeTask(now) {

    let users = await DatabaseHelper.getUsers();
    
    const userList = users.map((userInfo) => {
      return exclude(userInfo, [
        "password",
        "hash",
        "accessToken",
        "refreshToken",
      ]);
    });

    const taskList = await DatabaseHelper.getTasksSortedByPriority("asc");

    for (let i = 0; i < taskList.length; i++) {
      let task = taskList[i];

      let finalUserList = task.participantIndependent ? [systemUser]: userList;

      const aTaskResultList = await TaskExecutor.executeTaskForUserListForDatetime(
        task,
        finalUserList,
        now
      );

      if (aTaskResultList.length > 0) {
        await DatabaseHelper.insertTaskLogList(aTaskResultList);
      }
    }

    return;
  }

  static async processClock(now) {

    await DatabaseHelper.insertEvent({
      type: "clock",
      content: {
        dateString: date,
      },
    });

    console.log(`Clock event: ${now}`);

    /*
    switch (function_name) {
      case "execute_task":
        let resultList = executeTask(now);
        break;
      default:
        break;
    }
    */
  }
}
