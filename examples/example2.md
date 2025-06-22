# Example 2: Nudge all users who did not have enough steps count to take a break every 30 minutes during week days

In this example, we will create a simple nudging intervention that sends a message through email to users who did not have enought step count (e.g., 100) in the last 30 minutes, every 30 minutes during week days. A Fitbit wristband is used to measure step count. This example will show you how to develop an intervention that is a adapted to one's sensor data (Fitbit).

You can run this example by running the following command in the project folder:

```
yarn example2
```


## How to

To setup this project, you will need
- A server with a domain name (e.g., https://fitbitbreak.io)
- A Fitbit developer account (free)
- A Mailjet account (free) for sending emails

For this intervention, you will need two components to make this work
- A server that provide a web interface for users to authorize your app to access their Fitbigt data.
- A engine that will execute the decision rules to decide whether it is time to intervene and if so, deliver the intervention through email.

As developing a web application is not the focus of this framework, we will focus on developing the decision rule in thie tutorial.

Here is the step by step guide to create this example.

### Create the app

Create a folder called my-app2 under /apps and create an index.js file inside the /apps/my-app2 folder.

### Step 1: Import TimeEngine

In TimeFit, the TimeEngine is the main entry point of the framework. It is responsible for managing the execution of everything (or "tasks"). You will do everything through TimeEngine.


```javascript
import TimeEngine from "../time-engine/TimeEngine.js";
```
### Step 2: Register an action that will send emails to users.

First, import the `CustomEmailAction` provided by the framework.

Second, create an instance using `new` and supply the title and mesasge parameters of the notification.

Third, register this action to the engine and give it a name, "take-a-break-message." You can use this name later when creating a task that specifies when such action should be carried out.

```javascript
import CustomEmailAction from "@time-fit/action-collection/CustomEmailAction";
const newAction = new CustomEmailAction();
TimeEngine.registerAction("take-a-break-message", newAction);
```

### Step 3: Register a condition that will check Fitbit step counts

First, import the `CustomEmailAction` provided by the framework.

Second, create an instance using `new` and supply the title and mesasge parameters of the notification.

Third, register this action to the engine and give it a name, "fitbit-over-threshold." You can use this name later when creating a task that specifies a condition that needs to be satisfied for an action to be considered.

```javascript
import HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition from "@time-fit/data-source/fitbit/condition/HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition";
const fitbitCondition =
  new HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition();
TimeEngine.registerCondition("fitbit-over-threshold", fitbitCondition);
```

### Step 4: Provide parameters for the Fitbit condition to check step counts over the last 30 minutes
In `TimeFit`, we can specify a list of conditions that need to be satisfied before a task/action to be considered. The conditions are designed to accept parameters to configure what is being checked. Condition-specific parameters will be stored in a property named `criteria`.

In the case of `HasFitbitStepCountOverThresholdForPersonDuringPeriodCondition`, the first parameter to specify is the threshold of step counts, such as 100.

The second parameter to specify is the period of time we consider when checking step counts. The `TimeEngine` provides a function, `generateCriteriaPeriod()`,  to specify a period of time using simple syntax. You can specify the following parameters to the function:
- Period start reference: the reference point for the start of this period
- Period start offet type: the type of offset, such as adding time (i.e., "plus") and substracting time (i.e., "minus")
- Period start offset value: the amount of offset, such as 30 minutes, representing as `{minutes: 30}`.
- (The same for period end)

```javascript
let fitbitConditionParameters = {};
fitbitConditionParameters.criteria.threshold = 100; 
fitbitConditionParameters.criteria.period = TimeEngine.generateCriteriaPeriod("now", "minus", { minutes: 30 }, "now", "plus", { hours: 0 });
```

### Step 5: Provide parameters for the email action to send a message
In `TimeFit`, a action is designed to accept parameters to configure its beahvior.

In the case of `CustomEmailAction`, the first parameter to specify is the content of the email, such as "It's 30 minutes already. Take a break from your screen!"


```javascript
const emailActionParameters = {
  message: "It's 30 minutes already. Take a break from your screen!",
};
```




### Step 6: Register a new task that will be executed periodically (every 30 minutes)

In TimeFit, all the logic is defined in the form of tasks. For this sample application, we want this task to be carried out for every user, so we will use a "user task" provided by the framework to execute an action periodically.

In this example, we will register a system task using `registerOneCronUserConditionListActionListTask`, which creates a task that will be executed at a certain time for every user. We will supply the task label, the cron expression that determines the timing of when this task should be considered, a list of condition that need to be satisfied, and a list of actions to be considered as intervention. Note that by default, all conditions need to be satisfied for any action to be considered. If multiple actions are provided, each action will have equal chance to be selected by default.

```javascript
const conditionParametersList = [
  {
    name: "fitbit-over-threshold",
    parameters: fitbitConditionParameters,
  },
];
const actionParametersList = [
  {
    name: "take-a-break-message",
    parameters: emailActionParameters,
  },
];

TimeEngine.registerOneCronUserConditionListActionListTask(
  "take-a-break",
  "*/30 * * * 1-5",
  conditionParametersList,
  actionParametersList
);
```

### Step 4: Run the app

Finally, we will start the time engine to begin the nudging intervention.

```javascript
TimeEngine.start();
```

### References
- Complete code example: [fitbit-break engine](../apps/fitbit-break/engine.js)