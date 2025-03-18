import TimeEngine from "./time-engine/TimeEngine.mjs";
import DatabaseHelper from "./utility/DatabaseHelper.mjs";

async function myGetUserList() {
  const users = await DatabaseHelper.getUsers();
  const userList = users.map((userInfo) => {
    return exclude(userInfo, [
      "password",
      "hash",
      "accessToken",
      "refreshToken",
    ]);
  });
  return userList;
}

async function myGetTaskList() {
  // ideal version
  //const tasks = await DatabaseHelper.getTasksSortedByPriority("asc");

  // testing version
  const tasks = [
    {
      label: "print-hello",
      enabled: true,
      priority: 100,
      participantIndependent: true,
      preActivationLogging: false,
      ignoreTimezone: true,
      checkPoint: {
        // enabled: true/false
        type: "relative", // absolute vs. relative, ignore
        reference: {
          weekIndexList: [1, 2, 3, 4, 5, 6, 7],

          type: "fixed", // fixed or preference
          value: "12:00 AM", // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
        },
        offset: {
          type: "plus",
          value: { hours: 0 }, // {hours: 0}
        },
        repeat: {
          interval: { minutes: 1 }, // every x (5) minutes
          range: {
            // after: starting from that reference, before, strating befoore that reference

            before: {
              // will execute within distance (100 mins) prior to the reference point
              // set it to 24 * 60 means everything up to the start of the day (and even earlier, but irrelevant)
              distance: { minutes: 24 * 60 },
            },
            after: {
              // will execute within distance (100 mins) after the reference point
              // set it to 24 * 60 means everything til the end of the day (and even later, but irrelevant)
              distance: { minutes: 24 * 60 },
            },
          },
        },
      },
      group: {
        type: "all", // all or group or list
        membership: {
          // only matter if type is "group"
          gif: [],
          salience: [],
          modification: [],
        },
        list: [], //["test1", "test2"] // user name list, only matter if type is "list"
      },
      randomization: {
        // Note: could potentially separate this out to be random + action
        enabled: false, // true or false
        outcome: [
          {
            value: true, // not sure what to make out of it yet
            chance: 1.0,
            action: {
              type: "printHello", // messageLabel, or messageGroup
              messageLabel: "", //messageLabel, only matter if the type is messageLabel
              messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
              avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
              surveyType: "", //surveyLabel or surveyLink
              surveyLink: "",
            },
          },
        ],
      },
      preCondition: { enabled: false },
    },
  ];

  return tasks;
}

async function extractPreferenceTimeStringForUser(
  userInfo,
  checkPoint,
  preferenceTimeStringName,
  localWeekIndex
) {
  let referenceTimePropertyName = "";

  // TO DO: this part is very application specific, need to refactor this out
  if (preferenceTimeStringName == "wakeupTime") {
    if (localWeekIndex <= 5) {
      referenceTimePropertyName = "weekdayWakeup";
    } else {
      referenceTimePropertyName = "weekendWakeup";
    }
  } else if (preferenceTimeStringName == "bedTime") {
    if (localWeekIndex <= 5) {
      referenceTimePropertyName = "weekdayBed";
    } else {
      referenceTimePropertyName = "weekendBed";
    }
  } else {
    referenceTimePropertyName = checkPoint.reference.value;
  }

  return userInfo[referenceTimePropertyName];
}

// Register a function to get user list (so developers can decide whether user list needs to be retrieve every time or not)
TimeEngine.registerGetUserListFunction(myGetUserList);
// Register a function to get task list (so developers can decide whether task list needs to be retrieve every time or not)
TimeEngine.registerGetTaskListFunction(myGetTaskList);

// Register a function to check preference time string
TimeEngine.registerCheckPointPreferenceTimeStringFunction(extractPreferenceTimeStringForUser);

// Register a function to insert event
TimeEngine.registerInsertEventFunction(DatabaseHelper.insertEvent);

// Register a function to insert taskLog
TimeEngine.registerInsertTaskLogListFunction(DatabaseHelper.insertTaskLogList);

// Start the time engine
TimeEngine.start();
