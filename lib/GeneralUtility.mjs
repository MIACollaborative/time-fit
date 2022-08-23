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
            enabled: false,

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
                    weekIndexList:[1], // 1,2,3,4,5,6,7

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
                    value: {minutes: 0} // {hours: 0}
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
                list:[] // user name list, only matter if type is "list"
            },

            // Task randomization: defines the randomization that is needed for micro-randomized control trials, and the outcome such as an action that should be carried out.

            randomization:{

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
                        criteria: {
                            phase: "baseline"
                        }
                    },
                    {
                        // surveyFilledByThisPerson -> check whether a survey response is received within a time window
                        type: "surveyFilledByThisPerson",
                        criteria: {
                            // Id list: list of Qualtrics survey Ids to check
                            idList: ["SV_81aWO5sJPDhGZNA"], // baseline: SV_81aWO5sJPDhGZNA

                            // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                            idRelationship: "and",
                            period: {
                                // Start: the starting piont of the time window to consider
                                // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                                //start:{},

                                // End: the end point of the time window to consider
                                // Removing it means we are consider a time window up to this point
                                end:{
                                    // reference: currently only support "now" as the basis
                                    reference: "now", 

                                    // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                    // Plus 0 hours basically means using the reference point directly
                                    offset: {type: "plus", value: {hours: 0}}
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
            label: "fitbit process notification intraday heartrate",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: true,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "10:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: {minutes: 0} // {hours: 0}
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
                list:[] // user name list, only matter if type is "list"
            },
            randomization:{
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
                    weekIndexList:[1,2,3,4,5,6,7],
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
                    value: {minutes: 0} // {hours: 0}
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
                list:[] // user name list, only matter if type is "list"
            },
            randomization:{
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
            label: "fitbit process notification",// we need to manually make sure that it is unique
            enabled: true,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: true,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "06:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                    // preference
                    /*
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    */
                },
                offset: {
                    type: "plus",
                    value: {minutes: 0} // {hours: 0}
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
                list:[] // user name list, only matter if type is "list"
            },
            randomization:{
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
                                    value: {days: 7}
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
            label: "fitbit retrieval",// we need to manually make sure that it is unique
            enabled: false,
            priority: 100, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false, // hasn't supported yet
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
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
                    value: {minutes: 0} // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list:[] // user name list, only matter if type is "list"
            },
            randomization:{
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
                                    value: {days: 7}
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
                    weekIndexList:[1,2,3,4,5,6,7],
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
                    value: {minutes: 0} // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list:[] // user name list, only matter if type is "list"
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
                    value: {minutes: 0} // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list:[] // user name list, only matter if type is "list"
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
        },
        {
            label: "soo-scenario_1",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
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
                    value: {hours: 1} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [true],
                    salience: [],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 0.5,
                        action: {
                            type: "messageGroup", // messageLabel, or messageGroup
                            messageLabel: "survey_13", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "gif-m", // "nongif-m", // messageGroup, only matter if the type is messageGroup
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
            preCondition: { enabled: false }
        },
        {
            label: "soo-scenario_2",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "12:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {minutes: 0} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [true],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
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
                        value: false,
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
            label: "soo-scenario_3",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "03:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 7} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [true],
                    salience: [],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
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
                        value: false,
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
            label: "soo-scenario_4",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "05:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 0} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [true],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
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
            label: "soo-scenario_5",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 0} // {hours: 0}
                }
            },
            group: {
                type: "all", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
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
            label: "soo-scenario_6",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 1} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [false],
                    salience: [],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
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
                        value: false,
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
            label: "soo-scenario_7",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "relative", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[1,2,3,4,5,6,7],
                    // fixed
                    //type: "fixed", // fixed or preference
                    //value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    type: "preference", // fixed or preference
                    value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 7} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [false],
                    salience: [],
                    modification: []
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
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
                        value: false,
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
            label: "soo-scenario_8",// we need to manually make sure that it is unique
            enabled: false,
            priority: 1, // 1 (highest) ~ 100 (lowest)
            participantIndependent: false,
            ignoreTimezone: false,
            checkPoint: {
                type: "absolute", // absolute vs. relative, ignore
                reference: {
                    weekIndexList:[7],
                    // fixed
                    type: "fixed", // fixed or preference
                    value: "08:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                    
                    // preference
                    //type: "preference", // fixed or preference
                    //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
                },
                offset: {
                    type: "plus",
                    value: {hours: 0} // {hours: 0}
                }
            },
            group: {
                type: "group", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [],
                    salience: [],
                    modification: [true]
                },
                list:[], //["test1", "test2"] // user name list, only matter if type is "list"
            },
            randomization:{
                // Note: could potentially separate this out to be random + action
                enabled: true, // true or false
                outcome: [
                    {
                        value: true, // not sure what to make out of it yet
                        chance: 0.5,
                        action: {
                            type: "messageLabel", // messageLabel, or messageGroup
                            messageLabel: "prompt_4", //messageLabel, only matter if the type is messageLabel
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
                            messageLabel: "prompt_4", //messageLabel, only matter if the type is messageLabel
                            messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                            avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                            surveyType: "surveyLink", //surveyLabel or surveyLink
                            surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6QJa9e00C4gywQu"
                        }
                    }
                ]
            },
            preCondition: { enabled: false }
        }
    ];

    static fitbitUpdateSampleList = [
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1" },
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1"},
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1"},
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1"},
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1"},
        {"collectionType" : "activities", "date" : "2022-05-28", "ownerId" : "4SW9W9", "ownerType" : "user", "subscriptionId" : "1"},
        {"collectionType" : "activities", "date" : "2021-12-14", "ownerId" : "9BK4CS", "ownerType" : "user", "subscriptionId" : "9BK4CS-activities-3" },
        {"collectionType" : "activities", "date" : "2022-05-01", "ownerId" : "9BK4CS", "ownerType" : "user", "subscriptionId" : "9BK4CS-activities-3"},
        {"collectionType" : "activities", "date" : "2021-12-21", "ownerId" : "9BK4CS", "ownerType" : "user", "subscriptionId" : "9BK4CS-activities-3"},

    ];

    static responseSampleList = [{ "participantId" : "test2", "responseId" : "R_wYqbwGbXs6tZzhL", "dateTime" : "2022-05-24T08:41:00Z", "surveyId" : "SV_cACIS909SMXMUp8", "surveyLink" : "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8", "surveyParamsString" : "study_code=test2", "content" : "huh?"},
    {"participantId" : "test1", "responseId" : "R_XMRDYnIbnI8GpOh", "dateTime" : "2022-06-22T01:52:00Z", "surveyId" : "SV_6QJa9e00C4gywQu", "surveyLink" : "https://umich.qualtrics.com/jfe/form/SV_6QJa9e00C4gywQu", "surveyParamsString" : "study_code=test1", "content" : "Stay the same"},
    { "participantId" : "test1", "responseId" : "R_2uX8jjqLRFDQ4m8", "dateTime" : "2022-06-22T01:54:00Z", "surveyId" : "SV_cACIS909SMXMUp8", "surveyLink" : "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8", "surveyParamsString" : "study_code=test1", "content" : "listen to music"},
    { "participantId" : "test1", "responseId" : "R_12JXBJDX1pinp5W", "dateTime" : "2022-06-22T01:57:00Z", "surveyId" : "SV_bBoOhje0dSNbZgq", "surveyLink" : "https://umich.qualtrics.com/jfe/form/SV_bBoOhje0dSNbZgq", "surveyParamsString" : "study_code=test1", "content" : "bring a friend"},
    { "participantId" : "test1", "responseId" : "R_12JXBJDX1pitest", "dateTime" : "2022-06-22T01:57:00Z", "surveyId" : "SV_81aWO5sJPDhGZNA", "surveyLink" : "https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA", "surveyParamsString" : "study_code=test1", "content" : "test"}];

    constructor() {

    }

    static getLocalTime(datetime, timezone) {
        return datetime.setZone(timezone);
    }

    static matchSqureBracketPlaceholder(message){
        var reString = `\\[[^\\[\\]]*\\]`;
        
        var re = new RegExp(reString,"g");

        const found = message.matchAll(re);

        let matchList = [...found].flat();

        console.log(JSON.stringify(matchList));

        return matchList;
    }

    static getLastWeekAsInterval(nowDateTime=DateTime.now()){
        //  Interval#start and Interval#end
        let start = nowDateTime.minus({days: 7}).startOf("week");
        let end = nowDateTime.minus({days: 7}).endOf("week");

        return Interval.fromDateTimes(start, end);
    }

    static filterFitbitWalkActivityListByDuration(walkList, minDurationInSeconds=10 * 60){
        return walkList.filter((record) => {
            return record.duration/1000 >= minDurationInSeconds;
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

    static diffDateTime(datetimeA, datetimeB, unit){
        return datetimeB.diff(datetimeA, unit);
    }

    static operateDateTime(dateTime, offset,  operator){
        let result = undefined;
        switch(operator){
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




    static extractSurveyLinkFromAction(actionInfo){
        let surveyURL = "";

        if(actionInfo["surveyType"] != undefined && actionInfo["surveyType"].length > 0){
            if( actionInfo["surveyType"] == "surveyLink"){
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

    static async getUserMessageFromGroupWithLowestFrequency(username, groupName){
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

    static generateCompositeIDForFitbitUpdate(aList=[]){
        return aList.join("_");
    }

    static async removeFitbitUpdateDuplicate(updateList){
        console.log(`${this.name} removeFitbitUpdateDuplicate: updateList: ${updateList}`);
        let compositeIDMap = {};

        let filteredList =  updateList.filter((item) => {
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([item.ownerId, item.collectionType, item.date]);
            console.log(`compositeId: ${compositeId}`);
            if(compositeIDMap[compositeId] == undefined){
                compositeIDMap[compositeId] = true;
                console.log(`First time: compositeId: ${compositeId}`);
                return true;
            }
            else{
                // run into the same signature before
                console.log(`Not the first time: compositeId: ${compositeId}`)
                return false;
            }
        });
        //console.log(`${this.name} removeFitbitUpdateDuplicate: filteredList: ${filteredList}`);
        
        return filteredList;
    }

    static isRequestFromLocalhost(req){
        let ip = GeneralUtility.getIPFromRequest(req);

        let ipSplit = ip.split(":");

        // check the last one
        return ipSplit[ipSplit.length - 1] == "127.0.0.1";
    }

    static getIPFromRequest(req){
        let forwarded = req.headers["x-forwarded-for"];
        console.log(`getIPFromRequest: req.headers["x-forwarded-for"]: ${forwarded}`);
        console.log(`getIPFromRequest:  req.connection.remoteAddress: ${ req.connection.remoteAddress}`);
        let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

        return ip;
    }

    static extractUserInfoCache(userInfo){

        const {id, password, hash, accessToken, refreshToken, ...rest} = userInfo;

        return {...rest};

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

    static convertRandomizationResultToString(rResult){
        let result = "";

        switch(rResult.type){
            case "noAction":
                result = `noAction`;
                break;
            default:
                result = `chance: ${rResult.theChoice.chance}, random: ${rResult.randomNumber}`;
                break;
        }

        return result;
    }

    static convertExecutionResultToString(eResult){
        let result = "";

        // {"type":"twilio","value":{"body":"Hello Pei-Yao, it's your bed time. Here is a random survey for you. https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=test1","numSegments":"0","direction":"outbound-api","from":null,"to":"+17342773256","dateUpdated":"2022-04-14T02:47:11.000Z","price":null,"errorMessage":null,"uri":"/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM6ca91344dfa04ef4891715a3615a7002.json","accountSid":"AC74873bd3ac4b62dbe6ef1d44f6ee2a99","numMedia":"0","status":"accepted","messagingServiceSid":"MG05ede0540932555ae0e1b9b88876a30f","sid":"SM6ca91344dfa04ef4891715a3615a7002","dateSent":null,"dateCreated":"2022-04-14T02:47:11.000Z","errorCode":null,"priceUnit":null,"apiVersion":"2010-04-01","subresourceUris":{"media":"/2010-04-01/Accounts/AC74873bd3ac4b62dbe6ef1d44f6ee2a99/Messages/SM6ca91344dfa04ef4891715a3615a7002/Media.json"}}}

        switch(eResult.type){
            case "noAction":
                result = `noAction`;
                break;
            default:
                result = `type: ${eResult.type}, status: ${eResult.value.status}, errorMessage: ${eResult.value.errorMessage}`;
                break;
        }

        return result;
    }

    static extractUserKeyAttributesToString(userInfo){
        
        if(userInfo == null){
            return "";
        }

        let result = `gif: ${userInfo.gif}, salience: ${userInfo.salience}, modification: ${userInfo.modification}, weekdayWakeup: ${userInfo.weekdayWakeup}, weekendWakeup: ${userInfo.weekendWakeup}, timesonze: ${userInfo.timezone}`;
        return result;
    }

    static doesFitbitInfoExist(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.fitbitId != null && userInfo.fitbitId.length > 0 && userInfo.accessToken != null && userInfo.accessToken.length > 0 && userInfo.refreshToken != null && userInfo.refreshToken.length > 0

    }

    static async sendTwilioMessage(phone, messageBody, mediaUrlList=[]) {
        console.log(`GeneralUtility.sendTwilioMessage: ${phone} - ${messageBody}`);
    
        const result = await fetch("/api/twilio?function_name=send_message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            messageBody,
            mediaUrlList: mediaUrlList.length > 0? mediaUrlList: null
          }),
        }).then((r) => {
          return r.json();
        });

        console.log(`GeneralUtility.sendTwilioMessage: result: ${result}`);
    
        return result;
      }

      static isPreferredNameSet(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.preferredName != undefined && userInfo.preferredName.length > 0;
      }

      static isWakeBedTimeSet(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.weekdayWakeup != undefined && userInfo.weekdayBed != undefined && userInfo.weekendWakeup != undefined && userInfo.weekendBed != undefined;
      }

      static isFitbitReminderTurnOff(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.fitbitReminderTurnOff != undefined && userInfo.fitbitReminderTurnOff;
      }

      static isWalkToJoySaveToContacts(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.saveWalkToJoyToContacts != undefined && userInfo.saveWalkToJoyToContacts;
      }

      static isTimezoneSet(userInfo){

        if(userInfo == null){
            return false;
        }

        return userInfo.timezone != undefined;
      }

      static isUserInfoPropertyValueMatched(userInfo, propertyValueObject){
        let result = true;

        Object.keys(propertyValueObject).forEach((propertyName) => {
            if(userInfo[propertyName] != propertyValueObject[propertyName]){
                result = false;
            }
        });

        return result;
      }

      static reduceBooleanArray(bArray, operator){
        let result = true;

        switch(operator){
            case "and":
                result = bArray.reduce((previousValue, currentValue) => previousValue && currentValue,true);
                break;
            case "or":
                result = bArray.reduce((previousValue, currentValue) => previousValue || currentValue,true);
                break;
            default:
                break;
        }
        
        return result;
      }
}