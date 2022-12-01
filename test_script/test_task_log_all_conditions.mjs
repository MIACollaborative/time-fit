import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

/*
let userList = await prisma.users.findMany({
    where: {
        username: {
          contains: "test1",
        },
      },
});

let userInfoList = JSON.parse(JSON.stringify(userList, replacer));
*/

const user = await prisma.users.findFirst({
    where:{
        username: "test1"
    }
})

let userInfo = JSON.parse(JSON.stringify(user, replacer));


// 2022.08.31 02:00 PM (EDT)
let dateTime = DateTime.fromJSDate(new Date(2022, 7, 31, 14, 0, 0));

// let's create one task that has all the conditions

let oneTask = {
    label: "Testing: all conditions with logs",// we need to manually make sure that it is unique
    enabled: true,
    priority: 1, // 1 (highest) ~ 100 (lowest)
    participantIndependent: false,
    ignoreTimezone: false,
    checkPoint: {
        type: "relative", // absolute vs. relative, ignore
        reference: {
            weekIndexList: [1, 2, 3, 4, 5, 6, 7],
            
            type: "fixed", // fixed or preference
            value: "12:40 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
        
        },
        offset: {
            type: "plus",
            value: { hours: 0 } // {hours: 0}
        }
    },
    group: {
        type: "all", // all or group or list
        membership: { // only matter if type is "group"
            gif: [],
            salience: [],
            modification: []
        },
        list: [], //["test1", "test2"] // user name list, only matter if type is "list"
    },
    randomization: {
        // Note: could potentially separate this out to be random + action
        enabled: true, // true or false
        outcome: [
            {
                value: true, // not sure what to make out of it yet
                chance: 1.0,
                action: {
                    type: "messageLabel", // messageLabel, or messageGroup
                    messageLabel: "prompt_25", //messageLabel, only matter if the type is messageLabel
                    messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                    avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                    surveyType: "", //surveyLabel or surveyLink
                    surveyLink: ""
                }
            },
            {
                value: false,
                chance: 0.0,
                action: {
                    type: "noAction", // no action
                }
            }
        ]
    },
    // preCondition: { enabled: false }
    preCondition: {
        // whether a task has precondition to consider.
        enabled: true,

        // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
        conditionRelationship: "and",

        // Condition list: list of conditions to be checked
        conditionList: [
            // Condition type: person, surveyFilledByThisPerson, timeInPeriod, hasFitbitUpdateForPersonByDateRange, hasHeartRateIntradayMinutesAboveThresholdForPersonByDate
            //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

            // Participants can be on either baseline or intervention to receive fitbit wearing reminders
            {
                // Check if participant's Fitbit isn't detecting activity
                type: "person", // This type can only check the specified date inside the start: {}
                opposite: false, // message sent = True
                criteria: {
                    phase: "baseline"
                }
            },
            {
                // surveyFilledByThisPerson -> check whether a survey response is received within a time window
                type: "surveyFilledByThisPerson",
                // opposite: true, //Use opposite for conditions that are not to be met                        
                criteria: {
                    // Id list: list of Qualtrics survey Ids to check
                    idList: ["SV_81aWO5sJPDhGZNA"], // baseline: SV_81aWO5sJPDhGZNA

                    // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                    // Use ("not any") for checking survey NOT filled, etc.                            
                    idRelationship: "not any",
                    period: {
                        end: {
                            // reference:
                            // now: current time
                            // today: end of today (23:59:59 pm)
                            reference: "now",

                            // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                            // Plus 0 hours basically means using the reference point directly
                            offset: { type: "plus", value: { hours: 0 } }
                        }
                    }
                }
            },
            {
                // Check if participant's Fitbit isn't detecting activity
                type: "messageSentDuringPeriod", // This type can only check the specified date inside the start: {}
                opposite: true, // message sent = True
                criteria: {
                    messageLabel: "investigator_19",
                    period: {
                        start: {
                            reference: "today",
                            offset: { type: "minus", value: { days: 7 } } // check today since 00:00:00 am
                        },
                        end: {
                            reference: "now",
                            offset: { type: "plus", value: { days: 0 } }
                        }
                    }
                }
            },
            {
                // type: "hasFitbitUpdateForPersonByDateRange" checks for fitbit update for the specified date
                // Check if participant's Fitbit IS updating/syncing - should return False
                type: "hasFitbitUpdateForPersonByDateRange",
                opposite: true,
                criteria: {
                    idList: [""],
                    idRelationship: "or",
                    period: {
                        start: {
                            reference: "today",
                            offset: { type: "minus", value: { days: 2 } } // There was an update detected since 2 days ago - must return False
                        },
                        end: {
                            reference: "today",
                            offset: { type: "plus", value: { hours: 0 } }
                        }
                    }
                }
            },
        ]
    }
};


let result = await TaskExecutor.executeActionForUser(action, userInfo, dateTime);

console.log(`result: ${JSON.stringify(result, null, 2)}`);
