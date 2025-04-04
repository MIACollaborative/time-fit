import TimeEngine from "./time-engine/TimeEngine.js";
import HelloAction from "./action-collection/HelloAction.js";
import MessageLabelAction from "./action-collection/MessageLabelAction.js";
import MessageGroupAction from "./action-collection/MessageGroupAction.js";
import GenerateFitbitManualUpdateAction from "./data-source/fitbit/action/GenerateFitbitManualUpdateAction.js";
import ProcessFitbitUpdateAction from "./data-source/fitbit/action/ProcessFitbitUpdateAction.js";
import ActivateParticipantAction from "./action-collection/ActivateParticipantAction.js";
import SetPersonalizedDailyStepsGoalAction from "./data-source/fitbit/action/SetPersonalizedDailyStepsGoalAction.js";
import UpdateStepsGoalToFitbitServerAction from "./data-source/fitbit/action/UpdateStepsGoalToFitbitServerAction.js";
import NoAction from "./action-collection/NoAction.js";
import PersonCondition from "./condition-collection/PersonCondition.js";
import TimeInPeriodCondition from "./condition-collection/TimeInPeriodCondition.js";


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
              // value: "0 12 * * 5",
              value: {
                dateCriteria: {
                  weekIndexList: [1, 2, 3, 4, 5, 6, 7],                  
                },
                timeStringType: "fixed", // fixed or preference
                timeString: "02:02 PM", // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
      // outcomes
      outcomes: {
        randomizationEnabled: false, // true or false
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
TimeEngine.registerAction("printHello", HelloAction);
TimeEngine.registerAction("messageLabel", MessageLabelAction);
TimeEngine.registerAction("messageGroup", MessageGroupAction);
TimeEngine.registerAction("messageLabelToResearchInvestigator", MessageLabelAction);
TimeEngine.registerAction("generateManualFitbitUpdate", GenerateFitbitManualUpdateAction);
TimeEngine.registerAction("processFitbitUpdate", ProcessFitbitUpdateAction);
TimeEngine.registerAction("activateParticipant", ActivateParticipantAction);
TimeEngine.registerAction("setPersonalizedDailyStepsGoal", SetPersonalizedDailyStepsGoalAction);
TimeEngine.registerAction("updateStepsGoalToFitbitServer", UpdateStepsGoalToFitbitServerAction);
TimeEngine.registerAction("noAction", NoAction);

// register all conditions
TimeEngine.registerCondition("person", PersonCondition);
TimeEngine.registerCondition("timeInPeriod", TimeInPeriodCondition);
TimeEngine.registerCondition("surveyFilledByThisPerson", SurveyFilledByThisPersonCondition);
TimeEngine.registerCondition("hasTaskLogErrorDuringPeriod", HasTaskLogErrorDuringPeriodCondition);
TimeEngine.registerCondition("HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriod", HasHeartRateIntradayMinutesAboveThresholdForPersonDuringPeriodCondition);
TimeEngine.registerCondition("hasFitbitUpdateForPersonDuringPeriod", HasFitbitUpdateForPersonDuringPeriodCondition);
TimeEngine.registerCondition("hasMessageSentDuringPeriod", HasMessageSentDuringPeriodCondition);

// Start the time engine
TimeEngine.start();
