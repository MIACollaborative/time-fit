# Example 1: Nudge users to take a break every 30 minutes during week days

In this example, we will create a simple nudging intervention that sends a message to users every 30 minutes during week days to remind them to take a break from their screen.

You can run this example by running the following command in the project folder:

```
yarn example1

```


## How to

Modify your index.js as follow

```
import TimeEngine from "./time-engine/TimeEngine.js";
import HelloAction from "./action-collection/HelloAction.js";

async function myGetTaskList() {
  const tasks = [
    {
      label: "print-hello",
      enabled: true,
      priority: 100,
      participantIndependent: true,
      preActivationLogging: false,
      ignoreTimezone: true,
      checkPoints: {
        enabled: true,
        pointList: [
          {
            type: "absolute",
            reference: {
              type: "cron",
              value: "*/30 * * * 1-5"
            }
          }
        ]
      },
      group: {
        type: "all",
      },
      // outcomes
      outcomes: {
        randomizationEnabled: false,
        outcomeList: [
          {
            chance: 1.0,
            action: {
              type: "printHello",
            },
          },
        ],
      },
      preCondition: { enabled: false },
    },
  ];

  return tasks;
}

// Register a function to get task list (so developers can decide whether task list needs to be retrieve every time or not)
TimeEngine.registerGetTaskListFunction(myGetTaskList);

// Register an action
TimeEngine.registerAction("", HelloAction);


// Start the time engine
TimeEngine.start();

```



