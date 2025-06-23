import TimeEngine from "@time-fit/time-engine/TimeEngine.js";
import DesktopNotificationAction from "@time-fit/action-collection/DesktopNotificationAction.js";

// create a register an action
const newAction = new DesktopNotificationAction(
  "TimeFit",
  "It's 30 minutes already. Take a break from your screen!"
);

TimeEngine.registerAction("take-a-break-message", newAction);

// register a new task that will be executed periodically
TimeEngine.registerOneSystemTaskWithCronAction(
  "take-a-break",
  "*/30 * * * 1-5",
  "take-a-break-message"
);

// Start the time engine
TimeEngine.start();
