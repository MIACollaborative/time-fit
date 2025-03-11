import { DateTime } from "luxon";
import TaskExecutor from "./TaskExecutor.mjs";

export default class TimeEngine {
  static scheduler = undefined;
  static lastDate = undefined;

  static getUserListFunction = undefined;
  static getTaskListFunction = undefined;
  static insertEventFunction = undefined;
  static insertTaskLogListFunction = undefined;

  static systemUser = {
    username: "system-user",
    preferredName: "System User",
    phone: "",
    timezone: "America/Detroit",

    // might not matter
    phase: "intervention",
  };

  constructor() {}

  static async start() {
    // check if an interval has already been set up
    if (!TimeEngine.scheduler) {
      TimeEngine.scheduler  =  setInterval(await TimeEngine.onInterval, 1 * 1000);
    }
  }

  static async stop() {
    clearInterval(TimeEngine.scheduler);
  }


  static registerGetUserListFunction(func){
    TimeEngine.getUserListFunction = func;
  }

  static registerGetTaskListFunction(func){
    TimeEngine.getTaskListFunction = func;
  }

  // registerInsertEventFunction
  static registerInsertEventFunction(func){
    TimeEngine.insertEventFunction = func;
  }

  // registerInsertTaskLogListFunction
  static registerInsertTaskLogListFunction(func){
    TimeEngine.insertTaskLogListFunction = func;
  } 


  static async onInterval(){
    const cronTime = process.hrtime();
    const now = DateTime.now().toJSDate();

    if (TimeEngine.lastDate !== undefined) {
      const lastDateMinute = DateTime.fromJSDate(TimeEngine.lastDate)
        .startOf("minute")
        .toJSDate();
      const nowMinute = DateTime.fromJSDate(now)
        .startOf("minute")
        .toJSDate();

      if (lastDateMinute.getTime() !== nowMinute.getTime() ) {
        await TimeEngine.processClock(now);
      } else {
        // Skipping event generation as lastDate and now are the same at the minute level
      }
    } 

    TimeEngine.lastDate = now;
  }

  static async executeTask(now) {

    const userList = await TimeEngine.getUserListFunction();


    const taskList = await TimeEngine.getTaskListFunction();
    for (let i = 0; i < taskList.length; i++) {
      let task = taskList[i];

      let finalUserList = task.participantIndependent ? [systemUser]: userList;

      const aTaskResultList = await TaskExecutor.executeTaskForUserListForDatetime(
        task,
        finalUserList,
        now
      );

      if (aTaskResultList.length > 0) {
        await TimeEngine.insertTaskLogListFunction(aTaskResultList);
      }
    }

    return;
  }

  static async processClock(now) {

    console.log(
      `Process clock at ${now}`
    );

    await TimeEngine.insertEventFunction({
      type: "clock",
      content: {
        dateString: now,
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
