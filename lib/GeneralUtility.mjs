import { DateTime, Interval } from "luxon";
import voca from 'voca';

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class GeneralUtility {
    //client;

    static FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY = "activity-summary";
    static FITBIT_INTRADAY_DATA_TYPE_HEART = "activity-heart";
    static FITBIT_INTRADAY_DATA_TYPE_STEP = "activity-step";

    static systemUser = {
        username: "system-user",
        //password String
        //hash String @unique

        // additional user information
        preferredName: "System User",
        phone: "",
        timezone: "America/Detroit",

        // for study management
        phase: "intervention",

        // for group assignment
        /*
        gif: true,
        salience: true,
        modification: true,
        */

        // for Fitbit
        /*
        fitbitId String?
        fitbitDisplayName String?
        fitbitFullName String?
        accessToken String?
        refreshToken String?
        */

        // for user preference
        /*
        weekdayWakeup DateTime?
        weekdayBed DateTime?
        weekendWakeup DateTime?
        weekendBed DateTime?
        */
    };

    static taskList = [
        {
            // Task label: need to manually make sure that it is unique, it will be stored in log so better create something that is meaningful and easily recognized
            label: "participant activation",

            // Task enabled: true means the system should process and act accordingly. false means the system should ignore this task for now.
            enabled: true,

            // Task priority (1: highest ~ 100: lowest): this priority determines how early a task will be considered at each timestamp. Tasks with highest priority (1) will be processed and executed. This is used to prioritize tasks that are more time-critical (e.g., sending P1 a SMS at 9 am), and allow task that are not so time-critical (e.g., retrieve Fitbit data at 9 am in the background.)
            priority: 1,

            // Whehter this task is independent of the participant (not supported yet): The property is added for tasks that either does not consider participant (e.g., send an email to the study coordinator at 9 am (ignoring timezone)) or shoudl nto consider participant's property (e.g., process one Fitbit update in the database).
            participantIndependent: false,

            // Whehter this task should executed for participants with timezone information set (lightly used)
            ignoreTimezone: false,

            // Check point: defines the timing contraint for task execution. It help determines whether a task should even be considered at a specific time tick (e.g., 9:05 am). For instance, if the value is 9:05 am, then the task will not pass the criteria at 9:04 am or 9:07 am.
            checkPoint: {

                // Check point type: defines whether time needs to be checked and how checkpoint will be calculated. It currently supports three values: absolute, relative, and ignore.
                // absolute: using only the "reference" property
                // relative: use both the "reference" and the "offset" properties to calculate the time
                // ignore: no need to check time for this task. It can be executed at any timestemp.
                type: "absolute",
                reference: {
                    // Checkpoint reference: defines the reference for calculating the time. For instance, the "wake up time" in "2 hours after the wake up time."
                    // Week index: Monday (1) to Sunday (7). Add the index for days in a week that this task should be considered. For instance, [1,2,3,4,5,6,7] means the task should be considered all days. [1] means as task should only be considerd on Monday.
                    weekIndexList: [1], // 1,2,3,4,5,6,7

                    // Reference type: defines the type of reference point for time. 
                    // Reference value: "fixed", "preference"
                    // fixed: it is a fully specify timestamp in the form of "XX:YY AM (or PM)"
                    // preference: it is described by the property of the participant  (e.g., wakeupTime, bedTime) 

                    type: "fixed",
                    value: "00:01 AM" // "00:01 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    // Checkpoint offset: defines the offset that will be added/substracted from the reference. For instance the "2 hours after" in "2 hours after the wake up time."
                    // Offset type: plus or minus
                    type: "plus",

                    // Offset value: define how much time (offset) to add/substract from the reference, using a javascript object property-value style format.
                    // for instance, with "plus" and "{minutes: 60}", it means adding 60 minutes as the offet to the refeernce. 
                    // together with the reference (i.e., 0:00:01 AM), this mean, the task is expected to be executed at 00:01 AM + 0 minutes => 00:01 AM.
                    value: { minutes: 0 } // {hours: 0}
                },
                // Checkpoint repeat: defines whether it is a task that should be repeated periodically before and after a checkpoint defines by reference+offset.
                // If a task should only be executed at the specified time, then simply removing this section.
                /*
                repeat: {
                    // Repeat interval: defines how often a task should be repeated. For instance, {minutes: 5} means a task should be considered every 5 minutes before and after a specified time.
                    interval: { minutes: 5 }, // every x (5) minutes

                    // Repeat range: defines the range of period before and after the specified time (using reference and offset) that this task should be considered.
                    range: {
                        // Range before: defines how early this task should be considered in relation to the basis (reference + offset).
                        // for instance, if we need a task to be executed every 5 mins in the 3 hours period prior to 07:00 AM (e.g., 4 ~ 7 AM), we will have distance: {minutes: 3 * 60} 
                        // Current implementation does not allow "overflow," meaning that it will only check for validity of the time within the same day. For instance, speicfying 01:00 AM, with "before" as 2 * 60 minutes technically means starting from 11:00 PM in the previous day. However, current implementation will only check any time starting from the start of the day, so it only check the period starting at 00:00 AM. The limitation comes from the use of weekIndex in "reference", so it will only consider that specific day.
                        before: {
                            // set it to 24 * 60 means everything up to the start of the day (even earlier time will be ignored)
                            distance: { minutes: 24 * 60 },
                        },
                        // Range after: defines how late this task should be considered in relation to the basis (reference + offset).
                        // for instance, if we need a task to be executed every 5 mins in the 3 hours period after 07:00 AM (e.g., 7 - 10 AM), we will have distance: {minutes: 3 * 60} 
                        after: {
                            // set it to 24 * 60 means everything til the end of the day (even later time will be ignored)
                            distance: { minutes: 24 * 60 },
                        }
                    }
                }
                */
            },

            // Task group: defines whether a task should be considered based on a participant's group assignment
            group: {
                // Group type: all, group, or list
                // all: consider all participants, ignoring the group assignment
                // group: consider particiapnts of a specific combination of group assignment(s). 
                // list (implemented but not used/tested yet): consider only participants with specific user names

                type: "all",

                // Group membership: defines what group assignment should be considered. This only matters if type is set to "group"
                // For instance, if we want a task to be considered for all participants assigned into the "gif" group, we will have gif: [true], and leave the rest of the [] empty.
                // Note that the current impelmentation of this membership test will pass as long as one group membership is matched. In other words, it doesn't support the definition of a membership test that involes more than one group. For instance gif:[true], salience:[false] will pass as long as a participant is either "true" for the gif grup or "false" for teh salience group. However, revision can be made to support multiple-group check, and that is for the future.
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },

            // Task randomization: defines the randomization that is needed for micro-randomized control trials, and the outcome such as an action that should be carried out.

            randomization: {

                // Randomization enabled: determine whether a randomization is needed. For a task that does not need randomization (e.g., a task that need to be executed as long as it passes the criteria above), set it to false and the first outcome in the "outcome" list (below) will be executed directly.
                // value: true, false
                enabled: true,

                // Randomization outcome: defines the chance (or probability) that an outcome should be chosen and the action that shoudl be carried out.

                outcome: [
                    {
                        // no use yet
                        value: true,

                        // outcome chance: defines the chance that this outcome should be selected.
                        // chance's value should be number from 0 (never happend) to 1 (always happen). The sum of chances in the outcome list should always equals to 1.0.
                        // Note: in the current implementation, the outcome will always be considered in order. In other words, if we accidnetally created two outcomes with chance 1, then the first one will always be chosen and executed. The second one will never be considered even with chance equals to 1.0.
                        chance: 1.0,

                        // Outcome action: defines the action that needs to be carried out if an outcome is selected after randomization
                        action: {

                            // Action type: defines the type of action that will be carried out. 
                            // Value: messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate, activateParticipant, ... See the executeActionForUser() function in TaskExecutor.mjs for all the available action type
                            type: "activateParticipant",

                            // for messaging

                            //messageLabel, only matter if the type is messageLabel. For instance: gif-a_1 ([group]_[id])
                            messageLabel: "",

                            // messageGroup, only matter if the type is messageGroup. For instance:  nongif-m.
                            messageGroup: "",

                            // Defines whether we want to minimize (not eliminate) the chance of sending the same message to the same user in a short period of time.
                            // In other words, set it to true means the system will avoid sending the same message to the same user unless all other messages have been sent out with the same number of times.
                            // This property ony makes sense for "messageGroup" as a message is drawn from a group. This also means if there is only a small group of messages that are being considered, then it is almost impossible to avoid sending the same message.
                            avoidHistory: false,

                            // Survey Type: define how to ieentify the survey to be attached with the message.
                            // Value: surveyLink (surveyLabel can be implemented in the future to support shorthand)
                            surveyType: "",

                            // Survey Link: specifies the survey link.
                            surveyLink: "",

                            // Retrieval Start Date: defines the starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            // This is only used for the action type, "retrieveFitbitData".
                            // The system currenty does not actively use this type of task
                            // 
                            /*
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: {days: 7}
                                }
                            },
                            */

                            // This is only used for the action type, "retrieveFitbitData".
                            // Currenlty only suport "7d" (a week)
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            /*
                            dataPeriod: "7d"
                            */
                        }
                    },
                    {
                        // no use yet
                        value: false,
                        chance: 0.0,

                        // the "noAction" type is a special kind of action that used to indicate when the system decides to not perform any aciton as the result of randomization. 
                        // For "noAction" type, no other propertises are needed.
                        // Typically, we use this type of action to complent the actual outcome/action so that the sum of chance will equal 1.0.
                        // For instance, if we want outcomeA to be the only real outcome with 50% of chance, then we will have the first outcome with 0.5, and a noAction outcome with 0.5.
                        action: {
                            type: "noAction", // no action
                        }
                    }
                ]
            },

            // Pre condition specify specific conditions or prerequisites that need to be satisfied to allow the task to be executed. This is ususally used to consider dynamic data, or infomration that might be changed acoss the whole process of the study. 
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        // opposite: true, //Use opposite for conditions that are not to be met                        
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
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                //start:{},
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
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
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate", // This type can only check the specified date inside the start: {}
                        opposite: false, // participant did adhere to wearing fitbit for +8 hours
                        criteria: {
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 1 } } // checks for wearing adherence 1 days ago (only that day)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}}
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate", // This type can only check the specified date inside the start: {}
                        opposite: false, // participant did adhere to wearing fitbit for +8 hours
                        criteria: {
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 2 } } // checks for wearing adherence 2 days ago (only that day)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}}
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate", // This type can only check the specified date inside the start: {}
                        opposite: false, // participant did adhere to wearing fitbit for +8 hours
                        criteria: {
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 3 } } // checks for wearing adherence 3 days ago (only that day)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}}
                                // }
                            }
                        }
                    }
                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "fitbit generate manual update",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false, // even if it is not set, we need to do it?
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "01:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                },
                /*
                repeat: {
                    interval: { minutes: 15 }, // every x (5) minutes
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
                        }
                    }
                }
                */
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 1.0,
                        action: {
                            type: "generateManualFitbitUpdate",
                            // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                            // for messaging
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: "",

                            // for fitbit
                            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            /*
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: {days: 7}
                                }
                            },
                            */
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            //dataPeriod: "7d"

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
            preCondition: { enabled: false }
        },
        {
            label: "fitbit process notification",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: true,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "00:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                },
                repeat: {
                    interval: { minutes: 5 }, // every x (5) minutes
                    range: {
                        // after: starting from that reference, before, strating befoore that reference
                        /*
                        before: {
                            // will execute within distance (100 mins) prior to the reference point
                            // set it to 24 * 60 means everything up to the start of the day (and even earlier, but irrelevant)
                            distance: { minutes: 24 * 60 },
                        },
                        */
                        after: {
                            // will execute within distance (100 mins) after the reference point
                            // set it to 24 * 60 means everything til the end of the day (and even later, but irrelevant)
                            distance: { minutes: 12 * 60 },
                        }
                    }
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 1.0,
                        action: {
                            type: "processFitbitUpdate",
                            // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                            // for messaging
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: "",

                            // for fitbit
                            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: { days: 7 }
                                }
                            },
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            dataPeriod: "7d"

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
            preCondition: { enabled: false }
        },
        {
            label: "intervention_morning gif",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    /*
                    type: "fixed", // fixed or preference
                    value: "00:14 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */

                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 1 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [true],
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
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "gif-m", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                        }
                    },
                    {
                        value: true,
                        chance: 0.5,
                        action: {
                            type: "noAction", // no action
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_salience",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "12:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [true],
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
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "salience", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                        }
                    },
                    {
                        value: true,
                        chance: 0.5,
                        action: {
                            type: "noAction", // no action
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_afternoon gif",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "03:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 7 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [true],
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
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "gif-a", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    },
                    {
                        value: true,
                        chance: 0.5,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_salience followup",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "05:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 0 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [true],
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
                        chance: 0.5,
                        action: {
                            type: "messageLabel", // messageLabel, or messageGroup
                            messageLabel: "prompt_11", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6EkGW2OdbOd7ltQ"
                        }
                    },
                    {
                        value: false,
                        chance: 0.5,
                        action: {
                            type: "messageLabel", // messageLabel, or messageGroup
                            messageLabel: "prompt_11", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_bw498iRdfDhdLme"
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "end-of-day survey",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_13", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_5c09fEzWBtL1ZYy"
                        }
                    },
                    {
                        value: false,
                        chance: 0.0,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_morning nongif",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 1 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [false],
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
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "nongif-m", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    },
                    {
                        value: true,
                        chance: 0.5,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_afternoon nongif",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 7 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [false],
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
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "nongif-a", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    },
                    {
                        value: true,
                        chance: 0.5,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: ""
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        },
        {
            label: "intervention_planning_2-6",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1],
                    // fixed
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 0 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: [true]
                },
                list: [], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 0.5,
                        action: {
                            type: "messageLabel", // messageLabel, or messageGroup
                            messageLabel: "prompt_16", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8"
                        }
                    },
                    {
                        value: false,
                        chance: 0.5,
                        action: {
                            type: "messageLabel", // messageLabel, or messageGroup
                            messageLabel: "prompt_16", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6QJa9e00C4gywQu"
                        }
                    }
                ]
            },
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            period: {
                                start: {
                                    reference: "activateAtDate",
                                    // activateAt tells the date and time the participant was activated to intervention phase
                                    // Need to make sure that the minute and seconds do not get in the way of calculatioon
                                    offset: { type: "plus", value: { days: 7 } }
                                },
                                end: {
                                    reference: "activateAtDate",
                                    offset: { type: "plus", value: { days: 42 } }
                                }
                            }
                        }
                    }

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "intervention_planning_1",// sending planning survey for the first week of intervention
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1],
                    // fixed
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 0 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: [true]
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
                            messageLabel: "prompt_16", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_bBoOhje0dSNbZgq"
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            period: {
                                start: {
                                    reference: "activateAtDate",
                                    // activateAt tells the date and time the participant was activated to intervention phase
                                    // Need to make sure that the minute and seconds do not get in the way of calculatioon
                                    offset: { type: "plus", value: { days: 0 } }
                                },
                                end: {
                                    reference: "activateAtDate",
                                    offset: { type: "plus", value: { days: 0 } }
                                }
                            }
                        }
                    }

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "baseline survey",// sending baseline survey
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 4 } // {hours: 0}
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
                            messageLabel: "prompt_1", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA"
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "baseline"
                        }
                    },
                    {
                        // Soo's Comment: This condition need to be modified to look for survey NOT filled out.
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_81aWO5sJPDhGZNA"], // baseline: SV_81aWO5sJPDhGZNA

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                //start:{},
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)                                    reference: "now",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "plus", value: { hours: 0 } }
                                }
                            }
                        }
                    },
                    {
                        type: "timeInPeriod",
                        // Time between 24hours after joining study (baseline week) and 72hours. (2-3 messages sent)
                        criteria: {
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 1 } } // Send message 1day after the activation day
                            },
                            end: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 3 } } // Send message a total of x3 times, then stop.
                            }
                        }
                    },

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "planned walk reminders",// sending reminder messages Tuesdays and Thursdays at wakeup + 4hours for planned strategy
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [2, 4], // Tuesday & Thursday
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 4 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: [true]
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
                            messageLabel: "prompt_10", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        // Check if participant completed the first planning survey
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_bBoOhje0dSNbZgq"], // first planning survey: SV_bBoOhje0dSNbZgq

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 3 } }
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "now",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "minus", value: { days: 0 } }
                                }
                            }
                        }
                    },
                    {
                        // Check if participant is in week 2-6 of intervention
                        type: "timeInPeriod",
                        criteria: {
                            start: {
                                reference: "ActivateAtDate",
                                offset: { type: "plus", value: { days: 7 } }
                            },
                            end: {
                                reference: "ActivateAtDate",
                                offset: { type: "plus", value: { days: 42 } }
                            }
                        }
                    },

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "weekly data summary",// sending the weekly data summary every Monday at wakeup (intervention week 1-6)
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1], // Monday
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_15", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    }
                ]
            }
        },
        {
            label: "adherence reminder for planning survey",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1],
                    // fixed
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 8 } // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: [true]
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
                            messageLabel: "prompt_17", //messageLabel, only matter if the type is messageLabel
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
            // Participant should be in intervention, and have not completed the planning survey after 8 hours of receiving the link to survey (Monday at wakeup+0).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        // Check if participant completed the "FIRST" OR "Try something new" OR "Stay the same" planning survey
                        // If any of the 3 surveys return true (completed within the last 8 hours), surveyFilledByThisPerson will return true
                        // If none of the surveys return true, surveyFilledByThisPerson will return false
                        type: "surveyFilledByThisPerson",
                        opposite: true, // flips the boolean at the end. It's NOT checking for opposite boolean.
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_bBoOhje0dSNbZgq", "SV_cACIS909SMXMUp8", "SV_cACIS909SMXMUp8"],// Soo's Note: Need to edit this in correct format

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "now",
                                    offset: { type: "minus", value: { hours: 8 } }
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
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
                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            // Weekly check-in survey sent on Sunday 8PM for intervention week 2-6
            label: "weekly checkin_2-6",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [7], // Sunday
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_4", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_73Dz01KrwwLUyk6"
                        }
                    },
                    {
                        value: false,
                        chance: 0.0,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                        }
                    }
                ]
            },
            // preCondition: { enabled: false }
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink.
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            period: {
                                start: {
                                    reference: "activateAtDate",
                                    // activateAt tells the date and time the participant was activated to intervention phase
                                    // Need to make sure that the minute and seconds do not get in the way of calculatioon
                                    offset: { type: "plus", value: { days: 7 } }
                                },
                                end: {
                                    reference: "activateAtDate",
                                    offset: { type: "plus", value: { days: 42 } }
                                }
                            }
                        }
                    }

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            // Weekly check-in survey sent on Sunday 8PM for intervention week 1
            label: "weekly checkin_1",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [7], // Sunday
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_5", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_73Dz01KrwwLUyk6"
                        }
                    },
                    {
                        value: false,
                        chance: 0.0,
                        action: {
                            type: "noAction", // messageLabel, or messageGroup
                        }
                    }
                ]
            },
            // preCondition: { enabled: false }
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink.
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            period: {
                                start: {
                                    reference: "activateAtDate",
                                    // activateAt tells the date and time the participant was activated to intervention phase
                                    // Need to make sure that the minute and seconds do not get in the way of calculatioon
                                    offset: { type: "plus", value: { days: 1 } }
                                },
                                end: {
                                    reference: "activateAtDate",
                                    offset: { type: "plus", value: { days: 7 } }
                                }
                            }
                        }
                    }

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            // Send adherence reminder for weekly checkin survey on Monday and Tuesday 8PM IF the survey was not completed
            label: "adherence reminder for weekly checkin survey",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "fixed", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_6", //messageLabel, only matter if the type is messageLabel
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
            // Participant should be in intervention, and have not completed the weekly check-in survey after 24 hours and 48 hours of receiving the link to survey.
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        // Check if participant completed the weekly check-in survey
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_73Dz01KrwwLUyk6"],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "now",
                                    offset: { type: "minus", value: { hours: 48 } }
                                },

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
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
                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            // Send adherence reminder for end-of-day survey IF user did not complete survey consecutively for 2 days (48 hours), send reminder at 6PM up to x2 days
            label: "adherence reminder for end-of-day survey",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "fixed", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "06:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_14", //messageLabel, only matter if the type is messageLabel
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
            // Need to fix preCondition to check for consecutive, incomplete days 
            // preCondition: { enabled: false }
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention"
                        }
                    },
                    {
                        // Check if participant didn't completed the end-of-day survey
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_5c09fEzWBtL1ZYy"],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 2 } } // if survey was NOT completed the last 2 days, send the message.
                                },
                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "today",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "plus", value: { hours: 0 } }
                                }
                            }
                        }
                    },
                    {
                        // Check if participant did completed the end-of-day survey
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_5c09fEzWBtL1ZYy"],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "now",
                                    offset: { type: "minus", value: { days: 4 } } // if survey WAS completed the last 4 days
                                },
                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
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
                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            // Send adherence reminder for reconnecting Fitbit IF no new data was received from Fitbit app for 2 consecutive days: up to x3 days at wakeup+2hr
            label: "adherence reminder for fitbit reconnection",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 2 } // {hours: 0}
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
                            messageLabel: "prompt_7", //messageLabel, only matter if the type is messageLabel
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

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "not any", // All conditions should return False

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    // Participants can be on either baseline or intervention to receive fitbit connection reminders
                    {
                        // type: "hasFitbitUpdateForPersonByDateRange" checks for fitbit update for the specified date
                        // Check if participant's Fitbit IS updating/syncing - should return False
                        type: "hasFitbitUpdateForPersonByDateRange",
                        opposite: false,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 2 } } // There was an update detected since 2 days ago - must return False
                                },
                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "today",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "plus", value: { hours: 0 } }
                                }
                            }
                        }
                    },
                    {
                        // type: "hasFitbitUpdateForPersonByDateRange" checks for fitbit update for the specified date
                        // Check if participant's Fitbit isn't updating/syncing - should return True for reminder to stop at day 5.
                        type: "hasFitbitUpdateForPersonByDateRange",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 5 } } // There wasn't an update detected since 5 days ago
                                },
                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "today",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "plus", value: { hours: 0 } }
                                }
                            }
                        }
                    },
                ]
            }
        },
        {
            // Send adherence reminder for wearing Fitbit for +8hours IF non-worn days for 2 consecutive days, x3 days at wakeup+1hour
            label: "adherence reminder for fitbit wearing",// we need to manually make sure that it is unique
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { hours: 1 } // {hours: 0}
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
                            messageLabel: "prompt_8", //messageLabel, only matter if the type is messageLabel
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
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
                        opposite: false, // participant has been wearing = False
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled, at least one ("or") survey to be filled, or ("not any").
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8, // Day of checking for adherence (wakeup+1hr) will always return adherent, thus won't be counted towards Fitbit non-worn day.

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 2 } } // check today since 00:00:00 am
                                },
                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "today",
                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "minus", value: { days: 1 } }
                                }
                            }
                        }
                    },
                    {
                        // Check if participant's Fitbit has detected activity two days ago - should return False (not any)
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                        opposite: false,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "or",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: { // check between: the start of the day of two days ago - today
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 5 } }
                                },
                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)
                                    reference: "today",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "minus", value: { days: 3 } }
                                }
                            }
                        }
                    },
                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "post-study survey",// sending post-study survey at the end of intervention at Sunday 8:30PM, as well as Monday and Tuesday for reminder
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "8:30 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_21", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_40BdTOYS0w7xHRY"
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention" // intervention +2days
                        }
                    },
                    {
                        // Soo's Comment: This condition need to be modified to look for survey NOT filled out.
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_40BdTOYS0w7xHRY"], // baseline: SV_81aWO5sJPDhGZNA

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                //start:{},
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
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
                        type: "timeInPeriod",
                        criteria: {
                            start: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 42 } }
                            },
                            end: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 44 } }
                            }
                        }
                    }

                    // timeInPeriod -> check time constraint based on a time window
                    // Note: have a draft implemention, but might not be used or well tested.
                ]
            }
        },
        {
            label: "investigator_end-of-day notice",// Send phone call reminder to investigator IF missed end-of-day survey for 5 consecutive days

            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "9:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_20", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention" // intervention +2days
                        }
                    },
                    {
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_5c09fEzWBtL1ZYy"],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    // now: current time
                                    // today: end of today (23:59:59 pm)                                    reference: "now",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "minus", value: { days: 5 } } // checks for survey completion the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    reference: "now",
                                    // now: current time
                                    // today: end of today (23:59:59 pm)                                    reference: "now",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "minus", value: { days: 0 } } // checks for survey completion the last 5 days (not including the day of message)
                                }
                            }
                        }
                    },
                ]
            }
        },
        {
            label: "investigator_fitbit wearing notice",// Send phone call reminder to investigator IF non-worn days for 6 consecutive days at 9AM

            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "9:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_19", //messageLabel, only matter if the type is messageLabel
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
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 1 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 2 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 3 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 4 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 5 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                    {
                        type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                        opposite: true,
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: [""],

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "and",

                            // check whether minutes >= wearingLowerBoundMinutes
                            wearingLowerBoundMinutes: 60 * 8,

                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 6 } } // checks for wearing adherence the last 5 days (not including the day of message)
                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End doesn't matter for Fitbit wearing
                                // Removing it means we are consider a time window up to this point
                                // end:{
                                //     // reference:
                                //     // now: current time
                                //     // today: end of today (23:59:59 pm)
                                //     reference: "today",

                                //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                //     // Plus 0 hours basically means using the reference point directly
                                //     offset: {type: "minus", value: {days: 6}} 
                                // }
                            }
                        }
                    },
                ]
            }
        },
        {
            label: "end of study message",// Send message once participant completes the post-study survey
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1],
                    // fixed
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_22", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention" // intervention +2days
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            start: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 42 } }
                            },
                            end: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 43 } }
                            }
                        }
                    }
                ]
            }
        },
        {
            label: "investigator_end-of-study notice",// Send message once participant completes the post-study survey
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1,],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "9:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_23", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "intervention" // intervention +2days
                        }
                    },
                    {
                        type: "timeInPeriod",
                        criteria: {
                            start: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 42 } }
                            },
                            end: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 43 } }
                            }
                        }
                    }
                ]
            }
        },
        {
            label: "investigator_baseline survey notice",
            enabled: true,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "9:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
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
                            messageLabel: "prompt_2", //messageLabel, only matter if the type is messageLabel
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
            // Soo's Note: Need a precondition here to check whether the participant is in week 2-7. If participant is in week1 of intervention, they need to be given a different surveyLink (First Planning survey).
            preCondition: {
                // whether a task has precondition to consider.
                enabled: true,

                // Condition Relationship: deciding whether we need all conditions to be satisfied ("and"), or we need one of the condition to be satisfied ("or"), or we need none of the conditions to be satisfied ("not any").
                conditionRelationship: "and",

                // Condition list: list of conditions to be checked
                conditionList: [
                    // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                    //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                    {
                        // person -> check a participant's property
                        // For instance, the following example check whehter a person is in its baseline phase (with the "phase" property set to "baseline")
                        type: "person",
                        criteria: {
                            phase: "baseline" // intervention +2days
                        }
                    },
                    {
                        // Soo's Comment: This condition need to be modified to look for survey NOT filled out.
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_81aWO5sJPDhGZNA"], // baseline: SV_81aWO5sJPDhGZNA

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            // Use ("not any") for checking survey NOT filled, etc.
                            idRelationship: "not any",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                start: {
                                    reference: "today",
                                    offset: { type: "minus", value: { days: 3 } }

                                },
                                // reference:
                                // now: current time
                                // today: start of today (00:00:00 am)

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end: {
                                    // reference:
                                    // now: current time
                                    // today: end of today (23:59:59 pm)                                    reference: "now",

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: { type: "plus", value: { hours: 0 } }
                                }
                            }
                        }
                    },
                    {
                        type: "timeInPeriod",
                        // Time between 24hours after joining study (baseline week) and 72hours. (2-3 messages sent)
                        criteria: {
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 3 } }
                            },
                            end: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 9 } }
                            }
                        }
                    },
                ]
            }
        }
    ];

    static fitbitUpdateSampleList = [
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2022-05-28", "ownerId": "4SW9W9", "ownerType": "user", "subscriptionId": "1" },
        { "collectionType": "activities", "date": "2021-12-14", "ownerId": "9BK4CS", "ownerType": "user", "subscriptionId": "9BK4CS-activities-3" },
        { "collectionType": "activities", "date": "2022-05-01", "ownerId": "9BK4CS", "ownerType": "user", "subscriptionId": "9BK4CS-activities-3" },
        { "collectionType": "activities", "date": "2021-12-21", "ownerId": "9BK4CS", "ownerType": "user", "subscriptionId": "9BK4CS-activities-3" },

    ];

    static responseSampleList = [{ "participantId": "test2", "responseId": "R_wYqbwGbXs6tZzhL", "dateTime": "2022-05-24T08:41:00Z", "surveyId": "SV_cACIS909SMXMUp8", "surveyLink": "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8", "surveyParamsString": "study_code=test2", "content": "huh?" },
    { "participantId": "test1", "responseId": "R_XMRDYnIbnI8GpOh", "dateTime": "2022-06-22T01:52:00Z", "surveyId": "SV_6QJa9e00C4gywQu", "surveyLink": "https://umich.qualtrics.com/jfe/form/SV_6QJa9e00C4gywQu", "surveyParamsString": "study_code=test1", "content": "Stay the same" },
    { "participantId": "test1", "responseId": "R_2uX8jjqLRFDQ4m8", "dateTime": "2022-06-22T01:54:00Z", "surveyId": "SV_cACIS909SMXMUp8", "surveyLink": "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8", "surveyParamsString": "study_code=test1", "content": "listen to music" },
    { "participantId": "test1", "responseId": "R_12JXBJDX1pinp5W", "dateTime": "2022-06-22T01:57:00Z", "surveyId": "SV_bBoOhje0dSNbZgq", "surveyLink": "https://umich.qualtrics.com/jfe/form/SV_bBoOhje0dSNbZgq", "surveyParamsString": "study_code=test1", "content": "bring a friend" },
    { "participantId": "test1", "responseId": "R_12JXBJDX1pitest", "dateTime": "2022-06-22T01:57:00Z", "surveyId": "SV_81aWO5sJPDhGZNA", "surveyLink": "https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA", "surveyParamsString": "study_code=test1", "content": "test" }];

    constructor() {

    }

    static usTimeZoneOffetInfoList = [
        { name: 'America/New_York', offset: -240, offsetLabel: 'GMT -4' },
        { name: 'America/Detroit', offset: -240, offsetLabel: 'GMT -4' },
        {
            name: 'America/Kentucky/Louisville',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Kentucky/Monticello',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Indianapolis',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Vincennes',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Winamac',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Marengo',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Petersburg',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Vevay',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        { name: 'America/Chicago', offset: -300, offsetLabel: 'GMT -5' },
        {
            name: 'America/Indiana/Tell_City',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        { name: 'America/Indiana/Knox', offset: -300, offsetLabel: 'GMT -5' },
        { name: 'America/Menominee', offset: -300, offsetLabel: 'GMT -5' },
        {
            name: 'America/North_Dakota/Center',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        {
            name: 'America/North_Dakota/New_Salem',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        {
            name: 'America/North_Dakota/Beulah',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        { name: 'America/Denver', offset: -360, offsetLabel: 'GMT -6' },
        { name: 'America/Boise', offset: -360, offsetLabel: 'GMT -6' },
        { name: 'America/Phoenix', offset: -420, offsetLabel: 'GMT -7' },
        { name: 'America/Los_Angeles', offset: -420, offsetLabel: 'GMT -7' },
        { name: 'America/Anchorage', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Juneau', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Sitka', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Metlakatla', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Yakutat', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Nome', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Adak', offset: -540, offsetLabel: 'GMT -9' },
        { name: 'Pacific/Honolulu', offset: -600, offsetLabel: 'GMT -10' }
    ]

    static getCSVStringFromObjectList(objectList) {
        let csvString = "";

        if (objectList.length == 0) {
            return csvString;
        }
        // prepare the csv string
        let headerList = Object.keys(objectList[0]);
        let headerString = headerList.join(",");
        csvString += headerString + "\n";

        // now the content
        objectList.forEach((info) => {
            let contentList = headerList.map((columnName) => {
                return info[columnName];
            });

            let contentString = contentList.join(",");
            csvString += contentString + "\n";
        });

        return csvString;
    }

    static getLocalTime(datetime, timezone) {
        return datetime.setZone(timezone);
    }

    static matchSqureBracketPlaceholder(message) {
        var reString = `\\[[^\\[\\]]*\\]`;

        var re = new RegExp(reString, "g");

        const found = message.matchAll(re);

        let matchList = [...found].flat();

        console.log(JSON.stringify(matchList));

        return matchList;
    }

    static getLastWeekAsInterval(nowDateTime = DateTime.now()) {
        //  Interval#start and Interval#end
        let start = nowDateTime.minus({ days: 7 }).startOf("week");
        let end = nowDateTime.minus({ days: 7 }).endOf("week");

        return Interval.fromDateTimes(start, end);
    }

    static filterFitbitWalkActivityListByDuration(walkList, minDurationInSeconds = 10 * 60) {
        return walkList.filter((record) => {
            return record.duration / 1000 >= minDurationInSeconds;
        });
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

    static diffDateTime(datetimeA, datetimeB, unit) {
        return datetimeB.diff(datetimeA, unit);
    }

    static operateDateTime(dateTime, offset, operator) {
        let result = undefined;
        switch (operator) {
            case "plus":
                result = dateTime.plus(offset);
                break;
            case "minus":
                result = dateTime.minus(offset);
                break;
            default:
                break;

        }

        return result;
    }




    static extractSurveyLinkFromAction(actionInfo) {
        let surveyURL = "";

        if (actionInfo["surveyType"] != undefined && actionInfo["surveyType"].length > 0) {
            if (actionInfo["surveyType"] == "surveyLink") {
                surveyURL = actionInfo["surveyLink"];
            }
            /*
            else if( actionInfo["surveyType"] == "surveyLabel"){
                let surveyLabel = actionInfo["surveyLabel"];
                let survey
                surveyURL = actionInfo["surveyLink"];
            }
            */
        }

        return surveyURL;
    }

    static async getUserMessageFromGroupWithLowestFrequency(username, groupName) {
        //let resultList = [];

        let frequencyDict = await GeneralUtility.getUserMessageFromGroupCountDict(username, groupName);

        console.log(`getUserMessageFromGroupWithLowestFrequency.frequencyDict: ${JSON.stringify(frequencyDict)}`);

        let frequencyList = Object.keys(frequencyDict).map((messageLabel) => {
            return {
                label: messageLabel,
                info: frequencyDict[messageLabel].info,
                frequency: frequencyDict[messageLabel].count
            };
        });

        console.log(`frequencyList: ${JSON.stringify(frequencyList)}`);

        frequencyList.sort((a, b) => {
            return a.frequency - b.frequency;
        });

        let lowestFrequency = frequencyList[0].frequency;

        let lowFrequencyList = frequencyList.filter((item) => {
            return item.frequency == lowestFrequency;
        });


        return lowFrequencyList;
    }

    static generateCompositeIDForFitbitUpdate(aList = []) {
        return aList.join("_");
    }

    static async removeFitbitUpdateDuplicate(updateList) {
        console.log(`${this.name} removeFitbitUpdateDuplicate: updateList: ${updateList}`);
        let compositeIDMap = {};

        let filteredList = updateList.filter((item) => {
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([item.ownerId, item.collectionType, item.date]);
            console.log(`compositeId: ${compositeId}`);
            if (compositeIDMap[compositeId] == undefined) {
                compositeIDMap[compositeId] = true;
                console.log(`First time: compositeId: ${compositeId}`);
                return true;
            }
            else {
                // run into the same signature before
                console.log(`Not the first time: compositeId: ${compositeId}`)
                return false;
            }
        });
        //console.log(`${this.name} removeFitbitUpdateDuplicate: filteredList: ${filteredList}`);

        return filteredList;
    }

    static isRequestFromLocalhost(req) {
        let ip = GeneralUtility.getIPFromRequest(req);

        let ipSplit = ip.split(":");

        // check the last one
        return ipSplit[ipSplit.length - 1] == "127.0.0.1";
    }

    static getIPFromRequest(req) {
        let forwarded = req.headers["x-forwarded-for"];
        console.log(`getIPFromRequest: req.headers["x-forwarded-for"]: ${forwarded}`);
        console.log(`getIPFromRequest:  req.connection.remoteAddress: ${req.connection.remoteAddress}`);
        let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

        return ip;
    }

    static extractUserInfoCache(userInfo) {

        const { id, password, hash, accessToken, refreshToken, ...rest } = userInfo;

        return { ...rest };

        /*
        model users {
            id  String  @id @default(auto()) @map("_id") @db.ObjectId
            username String @unique
            password String
            hash String @unique
          
            // additional user information
            preferredName String?
            phone String?
            timezone String?
          
            // for group assignment
            gif Boolean? @default(false)
            salience Boolean? @default(false)
            modification Boolean? @default(false)
          
            // reference other collections
            taskLogList  taskLog[]
          
          
            // for Fitbit
            fitbitId String?
            fitbitDisplayName String?
            fitbitFullName String?
            accessToken String?
            refreshToken String?
          
            // for user preference
            weekdayWakeup DateTime?
            weekdayBed DateTime?
            weekendWakeup DateTime?
            weekendBed DateTime?
          
          
            // for time
            createdAt DateTime? @default(now())
            updatedAt DateTime? @updatedAt
          }
        */

    }

    static convertRandomizationResultToString(rResult) {
        let result = "";

        switch (rResult.type) {
            case "noAction":
                result = `noAction`;
                break;
            default:
                result = `chance: ${rResult.theChoice.chance}, random: ${rResult.randomNumber}`;
                break;
        }

        return result;
    }

    static convertExecutionResultToString(eResult) {
        let result = "";

        // {"type":"twilio","value":{"body":"Hello Pei-Yao, it's your bed time. Here is a random survey for you. https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=test1","numSegments":"0","direction":"outbound-api","from":null,"to":"+17342773256","dateUpdated":"2022-04-14T02:47:11.000Z","price":null,"errorMessage":null,"uri":"/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM6ca91344dfa04ef4891715a3615a7002.json","accountSid":"AC74873bd3ac4b62dbe6ef1d44f6ee2a99","numMedia":"0","status":"accepted","messagingServiceSid":"MG05ede0540932555ae0e1b9b88876a30f","sid":"SM6ca91344dfa04ef4891715a3615a7002","dateSent":null,"dateCreated":"2022-04-14T02:47:11.000Z","errorCode":null,"priceUnit":null,"apiVersion":"2010-04-01","subresourceUris":{"media":"/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM6ca91344dfa04ef4891715a3615a7002/Media.json"}}}

        switch (eResult.type) {
            case "noAction":
                result = `noAction`;
                break;
            default:
                result = `type: ${eResult.type}, status: ${eResult.value.status}, errorMessage: ${eResult.value.errorMessage}`;
                break;
        }

        return result;
    }

    static extractUserKeyAttributesToString(userInfo) {

        if (userInfo == null) {
            return "";
        }

        let result = `gif: ${userInfo.gif}, salience: ${userInfo.salience}, modification: ${userInfo.modification}, weekdayWakeup: ${userInfo.weekdayWakeup}, weekendWakeup: ${userInfo.weekendWakeup}, timesonze: ${userInfo.timezone}`;
        return result;
    }

    static doesFitbitInfoExist(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.fitbitId != null && userInfo.fitbitId.length > 0 && userInfo.accessToken != null && userInfo.accessToken.length > 0 && userInfo.refreshToken != null && userInfo.refreshToken.length > 0

    }

    static async sendTwilioMessage(phone, messageBody, mediaUrlList = []) {
        console.log(`GeneralUtility.sendTwilioMessage: ${phone} - ${messageBody}`);

        const result = await fetch("/api/twilio?function_name=send_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone,
                messageBody,
                mediaUrlList: mediaUrlList.length > 0 ? mediaUrlList : null
            }),
        }).then((r) => {
            return r.json();
        });

        console.log(`GeneralUtility.sendTwilioMessage: result: ${result}`);

        return result;
    }

    static isPreferredNameSet(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.preferredName != undefined && userInfo.preferredName.length > 0;
    }

    static isWakeBedTimeSet(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.weekdayWakeup != undefined && userInfo.weekdayBed != undefined && userInfo.weekendWakeup != undefined && userInfo.weekendBed != undefined;
    }

    static isFitbitReminderTurnOff(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.fitbitReminderTurnOff != undefined && userInfo.fitbitReminderTurnOff;
    }

    static isWalkToJoySaveToContacts(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.saveWalkToJoyToContacts != undefined && userInfo.saveWalkToJoyToContacts;
    }

    static isTimezoneSet(userInfo) {

        if (userInfo == null) {
            return false;
        }

        return userInfo.timezone != undefined;
    }

    static isUserInfoPropertyValueMatched(userInfo, propertyValueObject) {
        let result = true;

        Object.keys(propertyValueObject).forEach((propertyName) => {
            if (userInfo[propertyName] != propertyValueObject[propertyName]) {
                result = false;
            }
        });

        return result;
    }

    static reduceBooleanArray(bArray, operator) {
        let result = true;

        switch (operator) {
            case "and":
                result = bArray.reduce((previousValue, currentValue) => previousValue && currentValue, true);
                break;
            case "or":
                result = bArray.reduce((previousValue, currentValue) => previousValue || currentValue, true);
                break;
            case "not any":
                result = !bArray.reduce((previousValue, currentValue) => previousValue || currentValue, true);
                break;
            default:
                break;
        }

        return result;
    }

    static oldTaskList = [
        {
            label: "fitbit process notification intraday heartrate",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: true,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "12:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                },
                repeat: {
                    interval: { minutes: 5 }, // every x (5) minutes
                    range: {
                        // after: starting from that reference, before, strating befoore that reference
                        /*
                        before: {
                            // will execute within distance (100 mins) prior to the reference point
                            // set it to 24 * 60 means everything up to the start of the day (and even earlier, but irrelevant)
                            distance: { minutes: 24 * 60 },
                        },
                        */
                        after: {
                            // will execute within distance (100 mins) after the reference point
                            // set it to 24 * 60 means everything til the end of the day (and even later, but irrelevant)
                            distance: { minutes: 12 * 60 },
                        }
                    }
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 1.0,
                        action: {
                            type: "processFitbitUpdateForIntraday",
                            // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                            // for messaging
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: "",

                            // for FitbitUpdate intraday dat
                            fitbitIntradayDataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_HEART,

                            // for retrieveFitbitData
                            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            /*
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: {days: 7}
                                }
                            },
                            */
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            //dataPeriod: "7d"

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
            preCondition: { enabled: false }
        },
        {
            label: "fitbit process notification intraday steps",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: true,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                },
                repeat: {
                    interval: { minutes: 5 }, // every x (5) minutes
                    range: {
                        // after: starting from that reference, before, strating befoore that reference
                        /*
                        before: {
                            // will execute within distance (100 mins) prior to the reference point
                            // set it to 24 * 60 means everything up to the start of the day (and even earlier, but irrelevant)
                            distance: { minutes: 24 * 60 },
                        },
                        */
                        after: {
                            // will execute within distance (100 mins) after the reference point
                            // set it to 24 * 60 means everything til the end of the day (and even later, but irrelevant)
                            distance: { minutes: 2 * 60 },
                        }
                    }
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 1.0,
                        action: {
                            type: "processFitbitUpdateForIntraday",
                            // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                            // for messaging
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: "",

                            // for FitbitUpdate intraday dat
                            fitbitIntradayDataType: GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP,

                            // for retrieveFitbitData
                            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            /*
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: {days: 7}
                                }
                            },
                            */
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            //dataPeriod: "7d"

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
            preCondition: { enabled: false }
        },
        {
            label: "fitbit retrieval",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "7:10 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
            },
            randomization: {
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 1.0,
                        action: {
                            type: "retrieveFitbitData", // messageLabel, messageGroup, retrieveFitbitData

                            // for messaging
                            messageLabel: "", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "", //surveyLabel or surveyLink
                            surveyLink: "",

                            // for fitbit
                            // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                            retrievalStartDate: {
                                reference: "today",
                                offset: {
                                    type: "minus",
                                    value: { days: 7 }
                                }
                            },
                            // ideally: support these options: 1d | 7d | 30d | 1w | 1m
                            dataPeriod: "7d"

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
            preCondition: { enabled: false }
        },
        {
            label: "wakeupTime message",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                    // fixed
                    /*
                    type: "fixed", // fixed or preference
                    value: "00:14 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */

                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: { minutes: 0 } // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
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
                            messageLabel: "test_3", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "test", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8"
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
            preCondition: { enabled: false }
        },
        {
            label: "bedTime message",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList: [1, 2, 3, 4, 5, 6, 7],
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
                    value: { minutes: 0 } // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list: [] // user name list, only matter if type is "list"
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
                            messageLabel: "test_4", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "test", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8"
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
            preCondition: { enabled: false }
        }
    ];
}