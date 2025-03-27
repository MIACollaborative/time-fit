import { DateTime, Interval } from "luxon";
import voca from 'voca';

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class Backup {
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