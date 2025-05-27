# Example 1: Nudge yourself to take a break every 30 minutes during week days

In this example, we will create a simple nudging intervention that sends a message to you through desktop notification every 30 minutes during week days to remind you to take a break from your screen.

You can run this example by running the following command in the project folder:

```
yarn example1
```


## How to

Here is the step by step guide to create this example.

### Create the app

Create my-app1.js in the /src/apps folder.

### Step 1: Import TimeEngine

In TimeFit, the TimeEngine is the main entry point of the framework. It is responsible for managing the execution of everything (or "tasks"). You will do everything through TimeEngine.


```javascript
import TimeEngine from "../time-engine/TimeEngine.js";
```
### Step 2: Register an action that will send you a desktop notification

First, import the `DesktopNotificationAction` provided by the framework.

Second, create an instance using `new` and supply the title and mesasge parameters of the notification.

Third, register this action to the engine and give it a label, "take-a-break-message." You can use this label later when creating a task that specifies when such action should be carried out.


```javascript
import DesktopNotificationAction from "../action-collection/DesktopNotificationAction.js";

const newAction = new DesktopNotificationAction(
  "TimeFit",
  "It's 30 minutes already. Take a break from your screen!"
);

TimeEngine.registerAction("take-a-break-message", newAction);
```

### Step 3: Register a new task that will be executed periodically (every 30 minutes)

In TimeFit, all the logic is defined in the form of tasks. For simplicity, we wil use a system task that is provided by the framework to execute an action periodically. You can also create user tasks that will be executed for each user at a certain time.

In this example, we will register a system task using `registerOneCronSystemActionTask`, which creates a task that will be executed at a certain time. We will supply the task label, the cron expression that determines the timing of the action, and the label of the action to be executed. Since we already register an action, "take-a-break-message", earlier, we can simply refers to this action by its label when registering the task.

```javascript
TimeEngine.registerOneCronSystemActionTask(
  "take-a-break",
  "*/30 * * * 1-5",
  "take-a-break-message"
);
```

### Step 4: Run the app

Finally, we will start the time engine to begin the nudging intervention.

```javascript
TimeEngine.start();
```

### References
- Complete code example: [take-a-break.js](../src/apps/take-a-break.js)