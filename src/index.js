import TimeEngine from "./time-engine/TimeEngine.js";
import DatabaseHelper from "./utility/DatabaseHelper.js";

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
      checkPoints: {
        enabled: true, // enabled: true/false
        pointList: [
          {
            type: "relative", // absolute vs. relative (with offset)
            reference: {
              type: "spec", //"spec" or "cron"
              value: {
                dateCriteria: {
                  weekIndexList: [1, 2, 3, 4, 5, 6, 7],                  
                },
                timeStringType: "fixed", // fixed or preference
                timeString: "01:32 PM", // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
              }
            },
            offset: {
              type: "plus",
              value: { hours: 0 }, // {hours: 0}
            }
          }
        ]
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
        enabled: false, // true or false
        outcome: [
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

async function extractPreferenceTimeStringForUser(
  userInfo,
  checkPoint,
  preferenceTimeStringName,
  date
) {
  const datetime = DateTime.fromJSDate(date);
  const localTimeForUser = GeneralUtility.getLocalTime(datetime, userInfo.timezone);
  const localWeekIndex = localTimeForUser.weekday;

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
TimeEngine.registerCheckPointPreferenceTimeStringExtractionFunction(extractPreferenceTimeStringForUser);

// Start the time engine
TimeEngine.start();
