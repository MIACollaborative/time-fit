import { DateTime } from "luxon";
import prisma from "./prisma.mjs";

export default class MyUtility {
    //client;

    static aTaskSpec = {
        checkPoint: {
            type: "ignore", // absolute vs. relative, ignore
            reference: {
                weekIndexList:[1,2,3,4,5,6,7],
                // fixed
                /*
                type: "fixed", // fixed or preference
                value: "00:14 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                */
    
                // preference
                type: "preference", // fixed or preference
                value: "bedTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
            },
            offset: {
                type: "plus",
                value: {minutes: 1} // {hours: 0}
            }
        },
        group: {
            type: "all", // all or group
            membership: {
                gif: [true],
                salience: [],
                modification: []
            }
        },
        randomization:{
            // Note: could potentially separate this out to be random + action
            enabled: true, // true or false
            outcome: [
                {
                    value: true, // not sure what to make out of it yet
                    chance: 1.0,
                    action: {
                        type: "messageLabel", // messageLabel, or messageGroup
                        messageLabel: "gif-a_1", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "gif", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
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
    

    constructor() {

    }

    static getLocalTime(datetime, timezone) {
        return datetime.setZone(timezone);
    }

    static getWeekdayOrWeekend(datetime) {
        console.log(`getWeekdayOrWeekend: ${datetime.weekday}`);
        if (datetime.weekday < 6) {
            return "weekday";
        }
        else {
            return "weekend";
        }
    }


    static convertToUTCWithUTCDate(datetimeString, referenceUTC) {
        console.log(`convertToUTCWithUTCDate DateTime.fromISO(datetimeString).toUTC(): ${DateTime.fromISO(datetimeString).toUTC()}`);
        return DateTime.fromISO(datetimeString).toUTC().set({ year: referenceUTC.year, month: referenceUTC.month, day: referenceUTC.day, second: referenceUTC.second, millisecond: referenceUTC.millisecond });
    }

    static diffDateTime(datetimeA, datetimeB, unit){
        return datetimeB.diff(datetimeA, unit);
    }

    static async findMessageByLabel(mLabel){
        console.log(`MyUtility.findMessageByLabel: ${mLabel}`);
        const message = await prisma.message.findFirst({
            where: { label: mLabel},
        });
        console.log(`MyUtility.findMessageByLabel message: ${JSON.stringify(message)}`);
        return message;
    }

    static composeUserMessageForTwilio(userInfo, messageInfo, surveyURL){
        let result = {};

        // To Do: need to handle template for preferredName and survey link later

        if(messageInfo["interventionMessage"] != undefined && messageInfo["interventionMessage"].length > 0){
            result += messageInfo["interventionMessage"] + " ";
        }

        if(messageInfo["walkMessage"] != undefined && messageInfo["walkMessage"].length > 0){
            result += messageInfo["walkMessage"] + " ";
        }

        if(messageInfo["walkMessage"] != undefined && messageInfo["walkMessage"].length > 0){
            result += messageInfo["walkMessage"] + " ";
        }

        // now a randomSurvey
        result += `[Random survey]:${surveyURL}?study_code=${userInfo.username}`;

        return result;
    }
}