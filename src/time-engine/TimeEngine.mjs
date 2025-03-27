import { DateTime } from "luxon";
import TaskExecutor from "./TaskExecutor.mjs";
import DatabaseHelper from "../utility/DatabaseHelper.mjs";

export default class TimeEngine {
  static scheduler = undefined;
  static lastDate = undefined;

  static getUserListFunction = undefined;
  static getTaskListFunction = undefined;
  static insertEventFunction = undefined;
  static insertTaskLogListFunction = undefined;
  static checkPointPreferenceTimeStringExtractionFunction = undefined;

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
    TimeEngine.registerInsertEventFunction(DatabaseHelper.insertEvent);
    TimeEngine.registerInsertTaskLogListFunction(DatabaseHelper.insertTaskLogList);

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

  static registerCheckPointPreferenceTimeStringExtractionFunction(func){
    TimeEngine.checkPointPreferenceTimeStringExtractionFunction = func;
    // let TaskExecutor know about this function
    TaskExecutor.registerCheckPointPreferenceTimeStringExtractionFunction(func);
  } 


  static async onInterval(){
    const cronTime = process.hrtime();
    const now = DateTime.now().toJSDate();

    // for testing
    await TimeEngine.processClock(now);

    /*
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
    */

    TimeEngine.lastDate = now;
  }

  static async executeTask(now) {

    const taskList = await TimeEngine.getTaskListFunction();
    for (let i = 0; i < taskList.length; i++) {
      let task = taskList[i];

      // if task is not active, skip
      if (!task.enabled) {
        continue;
      }

      let userList = task.participantIndependent ? [TimeEngine.systemUser]: await TimeEngine.getUserListFunction();

      const aTaskResultList = await TaskExecutor.executeTaskForUserListForDate(
        task,
        userList,
        now
      );

      if (aTaskResultList.length > 0) {
        await TimeEngine.insertTaskLogListFunction(aTaskResultList);
      }
    }

    return;
  }

  static async processClock(now) {
    console.log(`Process clock at ${now}`);
    await TimeEngine.insertEventFunction({
      type: "clock",
      content: {
        dateString: now,
      },
    });
    const resultList = await TimeEngine.executeTask(now);
  }
}
