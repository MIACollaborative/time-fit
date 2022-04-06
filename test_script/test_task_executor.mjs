import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";

/*
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const databaseName = "walk_to_joy";
*/



import TaskExecutor from "../lib/TaskExecutor.mjs";




let aTaskSpec = {
    checkPoint: {
        type: "absolute", // absolute vs. relative
        reference: {
            weekIndexList:[1,2,3,4,5,6,7],
            type: "fixed", // fixed or preference
            value: "8:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
        },
        offset: {
            type: "plus",
            value: {hours: 0}
        }
    },
    group: {
        type: "all", // all or group
        membership: {
            gif: [true, false],
            salience: [true, false],
            modification: [true, false]
        }
    },
    randomization:{
        // Note: could potentially separate this out to be random + action
        enabled: true, // true or false
        outcome: [
            {
                value: true, // not sure what to make out of it yet
                chance: 0.5,
                action: {
                    type: "surveyId", // surveyId, or surveyGroup
                    surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                    surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                    avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                }
            },
            {
                value: false,
                chance: 0.5,
                action: {
                    type: "noAction", // no action
                }
            }
        ]
    },
    preCondition:{
        // stil in draft
        type: "surveyFilled",
        requirement: {
            type: "surveyId",
            surveyId: "XYZ",
            //surveyGroup: "gif" // advanced feature I guesss
            timingType: "absolute", // absolute vs. relative
            periood: { // this part needs a lot more thinking
                start: {
                    reference: {
                        weekday:[1,2,3,4,5,6,7],
                        type: "preference", // fixed or preference
                        value: "8:00 AM" // (if preference) (wakeupTime, bedTime, createdAt)
                    },
                    offset: {
                        type: "minus",
                        value: {days: 7}
                    }

                },
                end: {
                    reference: {
                        weekday:[1,2,3,4,5,6,7],
                        type: "fixed", // fixed or preference
                        value: "8:00 PM" // (if preference) (wakeupTime, bedTime, createdAt)
                    },
                    offset: {
                        type: "plus",
                        value: {hours: 0}
                    }
                }
            }
        }
    }
};


const userList = await prisma.users.findMany({
    select: {
        username: true,
        phone: true,
        preferredName: true,
        weekdayWakeup: true,
        weekdayBed: true,
        weekendWakeup: true,
        weekendBed: true,
        timezone: true
    },
});

TaskExecutor.executeTask(aTaskSpec, userList);