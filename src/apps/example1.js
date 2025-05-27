import TimeEngine from "../time-engine/TimeEngine.js";
import DesktopNotificationAction from "../action-collection/DesktopNotificationAction.js";
import TaskGeneratorHelper from "../helper/TaskGeneratorHelper.js";

// Register an action
const newAction = new DesktopNotificationAction(
  "TimeFit",
  "It's 30 minutes already. Take a break from your screen!"
);
TimeEngine.registerAction("take-a-break-message", newAction);

// TO DO: simplify the following event further
async function myGetTaskList() {
  const tasks = [
    TaskGeneratorHelper.generateCronActionTask(
      "take-a-break",
      //"*/30 * * * 1-5", // every 30 minutes on week days
      "* * * * *", // every minutes
      "take-a-break-message"
    ),
  ];

  return tasks;
}

// Register a function to get task list (so developers can decide whether task list needs to be retrieve every time or not)
TimeEngine.registerGetTaskListFunction(myGetTaskList);

// Start the time engine
TimeEngine.start();
