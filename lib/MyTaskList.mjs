const taskList = [
    {
        label: "task-error-notification",// we need to manually make sure that it is unique
        enabled: false,
        priority: 100, // 1 (highest) ~ 100 (lowest)
        participantIndependent: true,
        preActivationLogging: false,
        ignoreTimezone: true,
        checkPoint: {
            type: "relative", // absolute vs. relative, ignore
            reference: {
                weekIndexList: [1, 2, 3, 4, 5, 6, 7],

                type: "fixed", // fixed or preference
                value: "00:00 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

            },
            offset: {
                type: "plus",
                value: { hours: 0 } // {hours: 0}
            },
            repeat: {
                interval: { minutes: 240 }, // every x (5) minutes
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
                        distance: { minutes: 24 * 60 },
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
                        type: "messageLabelToResearchInvestigator", // messageLabel, or messageGroup
                        messageLabel: "investigator_27", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: false, // if we want to minimize the chance of sending the same message to k,the same user in a short window
                        surveyType: "", //surveyLabel or surveyLink
                        surveyLink: ""
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
                {
                    type: "hasTaskLogErrorByDateRange",
                    opposite: false,
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: [""], // baseline: SV_81aWO5sJPDhGZNA

                        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                        // Use ("not any") for checking survey NOT filled, etc.                            
                        idRelationship: "or",
                        period: {
                            start: {
                                // reference:
                                // now: current time
                                // today: end of today (23:59:59 pm)
                                reference: "now",

                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "minus", value: { hours: 4 } }
                            },
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
                }
            ]
        }
    },
    {
        label: "fitbit generate manual update",// we need to manually make sure that it is unique
        enabled: true,
        priority: 100, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
            repeat: {
                interval: { minutes: 1 * 60 }, // every x (5) minutes
                range: {
                    // after: starting from that reference, before, strating befoore that reference
                    before: {
                        // will execute within distance (100 mins) prior to the reference point
                        // set it to 24 * 60 means everything up to the start of the day (and even earlier, but irrelevant)
                        distance: { minutes: 1 * 60 },
                    },
                    
                    after: {
                        // will execute within distance (100 mins) after the reference point
                        // set it to 24 * 60 means everything til the end of the day (and even later, but irrelevant)
                        distance: { minutes: 24 * 60 },
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
        preActivationLogging: false,
        ignoreTimezone: false, // hasn't supported yet
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
            reference: {
                weekIndexList: [1, 2, 3, 4, 5, 6, 7],
                // fixed
                type: "fixed", // fixed or preference
                value: "00:02 AM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

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
                interval: { minutes: 4 }, // every x (5) minutes
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
                        distance: { minutes: 24 * 60 },
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
                    chance: 0.5,
                    action: {
                        type: "processFitbitUpdate",
                        // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                        // for messaging
                        /*
                        messageLabel: "", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        //avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                        surveyType: "", //surveyLabel or surveyLink
                        surveyLink: "",
                        */
                        // for processFitbitUpdate

                        // process update manuallly generate by walktojoy
                        prioritizeSystemUpdate: true,

                        // whehter to process the latest update or the earliest update
                        favorRecent: true


                        // for fitbit manual retrieval
                        // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                        /*
                        retrievalStartDate: {
                            reference: "today",
                            offset: {
                                type: "minus",
                                value: { days: 7 }
                            }
                        },
                        */
                        // ideally: support these options: 1d | 7d | 30d | 1w | 1m

                        //dataPeriod: "7d"

                    }
                },
                {
                    value: true, // not sure what to make out of it yet
                    chance: 0.5,
                    action: {
                        type: "processFitbitUpdate",
                        // messageLabel, messageGroup, retrieveFitbitData, processFitbitUpdate

                        // for messaging
                        /*
                        messageLabel: "", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                        surveyType: "", //surveyLabel or surveyLink
                        surveyLink: "",
                        */
                        // for processFitbitUpdate

                        // process update manuallly generate by walktojoy
                        prioritizeSystemUpdate: true,

                        // whehter to process the latest update or the earliest update
                        favorRecent: false


                        // for fitbit manual retrieval
                        // starting point of retrieval, expected to be a clean date (without hour, minute, and second)
                        /*
                        retrievalStartDate: {
                            reference: "today",
                            offset: {
                                type: "minus",
                                value: { days: 7 }
                            }
                        },
                        */
                        // ideally: support these options: 1d | 7d | 30d | 1w | 1m

                        //dataPeriod: "7d"

                    }
                },
            ]
        },
        preCondition: { enabled: false }
    },
    {
        label: "goal_setting",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                type: "fixed", // fixed or preference
                value: "12:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
            },
            offset: {
                type: "plus",
                value: { minutes: 0 } // {hours: 0}
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
                    }
                }
            }
        },
        group: {
            type: "list", // all or group or list
            membership: { // only matter if type is "group"
                gif: [],
                salience: [],
                modification: []
            },
            list: ["test1", "test2", "test3"], //["test1", "test2"] // user name list, only matter if type is "list"
        },
        randomization: {
            // Note: could potentially separate this out to be random + action
            enabled: false, // true or false
            outcome: [
                {
                    value: true, // not sure what to make out of it yet
                    chance: 1.0,
                    action: {
                        type: "setPersonalizedDailyStepsGoal", // messageLabel, messageGroup, or setPersonalDailyStepGoal
                        messageLabel: "", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: false, // if we want to minimize the chance of sending the same message to the same user in a short window
                    }
                },
            ]
        },
        preCondition: {
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
                                offset: { type: "plus", value: { years: 10 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "goal_setting_msg",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "relative", // absolute vs. relative, ignore
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
                value: { minutes: 30 } // {hours: 0}
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
            enabled: false, // true or false
            outcome: [
                {
                    value: true, // not sure what to make out of it yet
                    chance: 1.0,
                    action: {
                        type: "messageGroup", // messageLabel, or messageGroup
                        messageLabel: "", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "goal", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                    }
                },
            ]
        },
        preCondition: {
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
                                offset: { type: "plus", value: { days: 31 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "intervention_morning gif",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
        preCondition: {
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "intervention_salience",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
        preCondition: {
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "intervention_afternoon gif",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
        preCondition: {
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "intervention_end-of-day survey",// this task is only activated for Salience group
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        messageLabel: "prompt_13", //messageLabel, only matter if the type is messageLabel
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
                        messageLabel: "prompt_13", //messageLabel, only matter if the type is messageLabel
                        messageGroup: "", // "nongif-m", // messageGroup, only matter if the type is messageGroup
                        avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                        surveyType: "surveyLink", //surveyLabel or surveyLink
                        surveyLink: "https://umich.qualtrics.com/jfe/form/SV_bw498iRdfDhdLme"
                    }
                }
            ]
        },
        preCondition: {
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "end-of-day survey",// this task is only activated for non-salience group
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
            type: "group", // all or group or list
            membership: { // only matter if type is "group"
                gif: [],
                salience: [false],
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
        preCondition: {
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        },
    },
    {
        label: "baseline survey reminder",// sending baseline survey
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                    // Time between 24hours after joining study (baseline week) and 72hours. (2-3 messages sent)
                    criteria: {
                        period: {
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 1 } } // Send message 1day after the activation day
                            },
                            end: {
                                reference: "joinAtDate",
                                offset: { type: "plus", value: { days: 3 } } // Send message a total of x3 times, then stop.
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
        label: "weekly data summary",// sending the weekly data summary every Monday at wakeup (intervention week 1-6)
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        }
    },
    {
        // Weekly check-in survey sent on Sunday 8PM for intervention week 2-6
        label: "weekly checkin_2-6",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
        preActivationLogging: false,
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
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
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
                        messageLabel: "prompt-re_6", //messageLabel, only matter if the type is messageLabel
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
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
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
                        messageLabel: "prompt-re_14", //messageLabel, only matter if the type is messageLabel
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
        // Send adherence reminder for reconnecting Fitbit IF no new data was received from Fitbit app for 2 consecutive days: up to x3 days at wakeup+2hr
        label: "adherence reminder for fitbit reconnection",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        messageLabel: "prompt-re_7", //messageLabel, only matter if the type is messageLabel
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
            conditionRelationship: "and", // All conditions should return False

            // Condition list: list of conditions to be checked
            conditionList: [
                // Condition type: person, surveyFilledByThisPerson, timeInPeriod
                //See the checkOneConditionForUser() function in TaskExecutor.mjs for all the available condition type

                // Participants can be on either baseline or intervention to receive fitbit connection reminders
                {
                    // type: "hasFitbitUpdateForPersonByDateRange" checks for fitbit update for the specified date
                    // Check if participant's Fitbit IS updating/syncing - should return False
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
                {
                    // Check if participant's Fitbit isn't detecting activity
                    type: "messageSentDuringPeriod", // This type can only check the specified date inside the start: {}
                    opposite: true, // message was sent within 8hr = False; message was not sent within 8hr = True
                    criteria: {
                        idRelationship: "and",
                        messageLabel: "prompt-re_7",
                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            // reference:
                            // now: current time
                            // today: start of today (00:00:00 am)
                            start: {
                                reference: "today",
                                offset: { type: "minus", value: { hours: 8 } } // check today since 00:00:00 am
                            },
                            // End doesn't matter for Fitbit wearing
                            // Removing it means we are consider a time window up to this point
                            end: {
                                // reference:
                                // now: current time
                                // today: end of today (23:59:59 pm)
                                reference: "now",
                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "plus", value: { days: 0 } }
                            }
                        }
                    }
                },
                {
                    // Check if participant's Fitbit isn't detecting activity
                    type: "messageSentDuringPeriod", // This type can only check the specified date inside the start: {}
                    opposite: true, // message was sent within 8hr = False; message was not sent within 8hr = True
                    criteria: {
                        idRelationship: "and",
                        messageLabel: "prompt-re_8",
                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            // reference:
                            // now: current time
                            // today: start of today (00:00:00 am)
                            start: {
                                reference: "today",
                                offset: { type: "minus", value: { hours: 8 } } // check today since 00:00:00 am
                            },
                            // End doesn't matter for Fitbit wearing
                            // Removing it means we are consider a time window up to this point
                            end: {
                                // reference:
                                // now: current time
                                // today: end of today (23:59:59 pm)
                                reference: "now",
                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "plus", value: { days: 0 } }
                            }
                        }
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }

            ]
        }
    },
    {
        // Send adherence reminder for wearing Fitbit for +8hours IF non-worn days for 2 consecutive days, x3 days at wakeup+1hour
        label: "adherence reminder for fitbit wearing",// we need to manually make sure that it is unique
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        messageLabel: "prompt-re_8", //messageLabel, only matter if the type is messageLabel
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
                    // Check if participant's Fitbit has detected activity the past 2 days - should return False
                    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
                    opposite: false, // participant has been wearing = False
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: [""],

                        // Whehter we want all ("and") surveys to be filled, at least one ("or") survey to be filled, or ("not any").
                        // Use ("not any") for checking survey NOT filled, etc.
                        idRelationship: "not any", //is used for hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange

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
                    // Check if participant's Fitbit has detected activity the past 5 days - should return False
                    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                    opposite: false, // participant has been wearing = True -> False
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: [""],

                        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                        // Use ("not any") for checking survey NOT filled, etc.
                        idRelationship: "or", //is used for hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange

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
                {
                    // Check if participant's Fitbit isn't detecting activity
                    type: "messageSentDuringPeriod", // This type can only check the specified date inside the start: {}
                    opposite: true, // message was sent within 8hr = False; message was not sent within 8hr = True
                    criteria: {
                        idRelationship: "and",
                        messageLabel: "prompt-re_7",
                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            // reference:
                            // now: current time
                            // today: start of today (00:00:00 am)
                            start: {
                                reference: "today",
                                offset: { type: "minus", value: { hours: 8 } } // check today since 00:00:00 am
                            },
                            // End doesn't matter for Fitbit wearing
                            // Removing it means we are consider a time window up to this point
                            end: {
                                // reference:
                                // now: current time
                                // today: end of today (23:59:59 pm)
                                reference: "now",
                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "plus", value: { days: 0 } }
                            }
                        }
                    }
                },
                {
                    // Check if participant's Fitbit isn't detecting activity
                    type: "messageSentDuringPeriod", // This type can only check the specified date inside the start: {}
                    opposite: true, // message was sent within 8hr = False; message was not sent within 8hr = True
                    criteria: {
                        idRelationship: "and",
                        messageLabel: "prompt-re_8",
                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            // reference:
                            // now: current time
                            // today: start of today (00:00:00 am)
                            start: {
                                reference: "today",
                                offset: { type: "minus", value: { hours: 8 } } // check today since 00:00:00 am
                            },
                            // End doesn't matter for Fitbit wearing
                            // Removing it means we are consider a time window up to this point
                            end: {
                                // reference:
                                // now: current time
                                // today: end of today (23:59:59 pm)
                                reference: "now",
                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "plus", value: { days: 0 } }
                            }
                        }
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
                                offset: { type: "plus", value: { days: 42 } }

                            }
                        }
                    }
                }
            ]
        }
    },
    {
        label: "post-study survey",// sending post-study survey at the end of intervention at Sunday 8:30PM, as well as Monday and Tuesday for reminder
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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

                            start: {
                                reference: "today",
                                // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                                // Plus 0 hours basically means using the reference point directly
                                offset: { type: "minus", value: { days: 41 } } // checks for survey completion the last 5 days (not including the day of message)
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
                {
                    type: "timeInPeriod",
                    criteria: {
                        period: {
                            start: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 41 } }
                            },
                            end: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 43 } }
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
        label: "investigator_end-of-day notice",// Send phone call reminder to investigator IF missed end-of-day survey for 5 consecutive days

        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        type: "messageLabelToResearchInvestigator", // messageLabel, messageGroup, or messageLabelToResearchInvestigator
                        messageLabel: "investigator_20", //messageLabel, only matter if the type is messageLabel
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
                {
                    type: "surveyFilledByThisPerson",
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: ["SV_6EkGW2OdbOd7ltQ"],

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
                {
                    type: "surveyFilledByThisPerson",
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: ["SV_bw498iRdfDhdLme"],

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
                {
                    type: "timeInPeriod",
                    criteria: {
                        period: {
                            start: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 5 } }
                            },
                            end: {
                                reference: "activateAtDate",
                                offset: { type: "plus", value: { days: 42 } }
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        label: "investigator_fitbit wearing notice",// Send phone call reminder to investigator IF non-worn days for 6 consecutive days at 9AM

        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        type: "messageLabelToResearchInvestigator", // messageLabel, or messageGroup
                        messageLabel: "investigator_19", //messageLabel, only matter if the type is messageLabel
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
                    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                    opposite: false, // has worn fitbit the past 6days -> False
                    criteria: {
                        // Id list: list of Qualtrics survey Ids to check
                        idList: [""],

                        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                        // Use ("not any") for checking survey NOT filled, etc.
                        idRelationship: "not any", // used for hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange

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
                // {
                //     type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",
                //     opposite: true,
                //     criteria: {
                //         // Id list: list of Qualtrics survey Ids to check
                //         idList: [""],

                //         // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                //         // Use ("not any") for checking survey NOT filled, etc.
                //         idRelationship: "and",

                //         // check whether minutes >= wearingLowerBoundMinutes
                //         wearingLowerBoundMinutes: 60 * 8,

                //         period: {
                //             // Start: the starting piont of the time window to consider
                //             // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                //             start: {
                //                 reference: "today",
                //                 offset: { type: "minus", value: { days: 2 } } // checks for wearing adherence the last 5 days (not including the day of message)
                //             },
                //             // reference:
                //             // now: current time
                //             // today: start of today (00:00:00 am)

                //             // End doesn't matter for Fitbit wearing
                //             // Removing it means we are consider a time window up to this point
                //             // end:{
                //             //     // reference:
                //             //     // now: current time
                //             //     // today: end of today (23:59:59 pm)
                //             //     reference: "today",

                //             //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                //             //     // Plus 0 hours basically means using the reference point directly
                //             //     offset: {type: "minus", value: {days: 6}} 
                //             // }
                //         }
                //     }
                // },
                // {
                //     type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                //     opposite: true,
                //     criteria: {
                //         // Id list: list of Qualtrics survey Ids to check
                //         idList: [""],

                //         // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                //         // Use ("not any") for checking survey NOT filled, etc.
                //         idRelationship: "and",

                //         // check whether minutes >= wearingLowerBoundMinutes
                //         wearingLowerBoundMinutes: 60 * 8,

                //         period: {
                //             // Start: the starting piont of the time window to consider
                //             // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                //             start: {
                //                 reference: "today",
                //                 offset: { type: "minus", value: { days: 3 } } // checks for wearing adherence the last 5 days (not including the day of message)
                //             },
                //             // reference:
                //             // now: current time
                //             // today: start of today (00:00:00 am)

                //             // End doesn't matter for Fitbit wearing
                //             // Removing it means we are consider a time window up to this point
                //             // end:{
                //             //     // reference:
                //             //     // now: current time
                //             //     // today: end of today (23:59:59 pm)
                //             //     reference: "today",

                //             //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                //             //     // Plus 0 hours basically means using the reference point directly
                //             //     offset: {type: "minus", value: {days: 6}} 
                //             // }
                //         }
                //     }
                // },
                // {
                //     type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                //     opposite: true,
                //     criteria: {
                //         // Id list: list of Qualtrics survey Ids to check
                //         idList: [""],

                //         // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                //         // Use ("not any") for checking survey NOT filled, etc.
                //         idRelationship: "and",

                //         // check whether minutes >= wearingLowerBoundMinutes
                //         wearingLowerBoundMinutes: 60 * 8,

                //         period: {
                //             // Start: the starting piont of the time window to consider
                //             // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                //             start: {
                //                 reference: "today",
                //                 offset: { type: "minus", value: { days: 4 } } // checks for wearing adherence the last 5 days (not including the day of message)
                //             },
                //             // reference:
                //             // now: current time
                //             // today: start of today (00:00:00 am)

                //             // End doesn't matter for Fitbit wearing
                //             // Removing it means we are consider a time window up to this point
                //             // end:{
                //             //     // reference:
                //             //     // now: current time
                //             //     // today: end of today (23:59:59 pm)
                //             //     reference: "today",

                //             //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                //             //     // Plus 0 hours basically means using the reference point directly
                //             //     offset: {type: "minus", value: {days: 6}} 
                //             // }
                //         }
                //     }
                // },
                // {
                //     type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                //     opposite: true,
                //     criteria: {
                //         // Id list: list of Qualtrics survey Ids to check
                //         idList: [""],

                //         // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                //         // Use ("not any") for checking survey NOT filled, etc.
                //         idRelationship: "and",

                //         // check whether minutes >= wearingLowerBoundMinutes
                //         wearingLowerBoundMinutes: 60 * 8,

                //         period: {
                //             // Start: the starting piont of the time window to consider
                //             // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                //             start: {
                //                 reference: "today",
                //                 offset: { type: "minus", value: { days: 5 } } // checks for wearing adherence the last 5 days (not including the day of message)
                //             },
                //             // reference:
                //             // now: current time
                //             // today: start of today (00:00:00 am)

                //             // End doesn't matter for Fitbit wearing
                //             // Removing it means we are consider a time window up to this point
                //             // end:{
                //             //     // reference:
                //             //     // now: current time
                //             //     // today: end of today (23:59:59 pm)
                //             //     reference: "today",

                //             //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                //             //     // Plus 0 hours basically means using the reference point directly
                //             //     offset: {type: "minus", value: {days: 6}} 
                //             // }
                //         }
                //     }
                // },
                // {
                //     type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDate",
                //     opposite: true,
                //     criteria: {
                //         // Id list: list of Qualtrics survey Ids to check
                //         idList: [""],

                //         // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                //         // Use ("not any") for checking survey NOT filled, etc.
                //         idRelationship: "and",

                //         // check whether minutes >= wearingLowerBoundMinutes
                //         wearingLowerBoundMinutes: 60 * 8,

                //         period: {
                //             // Start: the starting piont of the time window to consider
                //             // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                //             start: {
                //                 reference: "today",
                //                 offset: { type: "minus", value: { days: 6 } } // checks for wearing adherence the last 5 days (not including the day of message)
                //             },
                //             // reference:
                //             // now: current time
                //             // today: start of today (00:00:00 am)

                //             // End doesn't matter for Fitbit wearing
                //             // Removing it means we are consider a time window up to this point
                //             // end:{
                //             //     // reference:
                //             //     // now: current time
                //             //     // today: end of today (23:59:59 pm)
                //             //     reference: "today",

                //             //     // offset, the time that will be added ("plus") or substracted ("minus") from the reference
                //             //     // Plus 0 hours basically means using the reference point directly
                //             //     offset: {type: "minus", value: {days: 6}} 
                //             // }
                //         }
                //     }
                // },
            ]
        }
    },
    {
        label: "end of study message",// Send message once participant completes the post-study survey
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        period: {
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
                }
            ]
        }
    },
    {
        label: "investigator_end-of-study notice",// Send message once participant completes the post-study survey
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
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
                        type: "messageLabelToResearchInvestigator", // messageLabel, messageGroup, or messageLabelToResearchInvestigator
                        messageLabel: "investigator_23", //messageLabel, only matter if the type is messageLabel
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
                        period: {
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
                }
            ]
        }
    },
    {
        label: "investigator_baseline survey notice",
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
            reference: {
                weekIndexList: [1],
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
                        type: "messageLabelToResearchInvestigator", // messageLabel, messageGroup, or messageLabelToResearchInvestigator
                        messageLabel: "investigator_2", //messageLabel, only matter if the type is messageLabel
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
                                reference: "joinAtDate",
                                offset: { type: "minus", value: { days: 0 } }

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
            ]
        }
    },
    {
        label: "intervention activation reminder message", //Send a reminder message the day before activation to Intervention
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
            reference: {
                weekIndexList: [7],
                type: "fixed", // fixed or preference
                value: "12:00 PM" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

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
                        messageLabel: "prompt_9", //messageLabel, only matter if the type is messageLabel
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
                        idRelationship: "and",
                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "minus", value: { days: 0 } }

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
                {
                    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
                    opposite: false, // participant did adhere to wearing fitbit for +8 hours for 3 days
                    criteria: {
                        idList: [""],

                        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                        // Use ("not any") for checking survey NOT filled, etc.
                        idRelationship: "and",

                        // check whether minutes >= wearingLowerBoundMinutes
                        wearingLowerBoundMinutes: 60 * 8,
                        wearingDayLowerBoundCount: 3, // if specified, idRelationshi ignored; don't make it 0

                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "minus", value: { days: 0 } } // checks for wearing adherence the last 6 days
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
        label: "baseline remaining survey message",
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "relative", // absolute vs. relative, ignore

            reference: {
                weekIndexList: [5, 6, 7],
                type: "preference", // fixed or preference
                value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
            },
            offset: {
                type: "plus",
                value: { hours: 1 }
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
                        messageLabel: "prompt_24", //messageLabel, only matter if the type is messageLabel
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
                                reference: "joinAtDate",
                                offset: { type: "minus", value: { days: 0 } }

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
            ]
        }
    },
    {
        label: "baseline remaining wears message",
        enabled: true,
        priority: 1, // 1 (highest) ~ 100 (lowest)
        participantIndependent: false,
        preActivationLogging: false,
        ignoreTimezone: false,
        checkPoint: {
            type: "absolute", // absolute vs. relative, ignore
            reference: {
                weekIndexList: [5, 6, 7],
                type: "preference", // fixed or preference
                value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime

                // preference
                //type: "preference", // fixed or preference
                //value: "wakeupTime" // (if preference) (wakeupTime, bedTime, createdAt) -> need to support wakeupTime
            },
            offset: {
                type: "plus",
                value: { hours: 1 }
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
                        messageLabel: "prompt_26", //messageLabel, only matter if the type is messageLabel
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
                    type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange", // This type can only check the specified date inside the start: {}
                    opposite: true, // participant did NOT adhere to wearing fitbit for +8 hours for 3 days = true
                    criteria: {
                        idList: [""],

                        // Whehter we want all ("and") surveys to be filled or at least one ("or") survey to be filled.
                        // Use ("not any") for checking survey NOT filled, etc.
                        idRelationship: "not any",

                        // check whether minutes >= wearingLowerBoundMinutes
                        wearingLowerBoundMinutes: 60 * 8,
                        wearingDayLowerBoundCount: 3, // if specified, idRelationshi ignored; don't make it 0

                        period: {
                            // Start: the starting piont of the time window to consider
                            // Removing it means we are consider a time window starting from the very beginning of time (year 200 for impelementation)
                            start: {
                                reference: "joinAtDate",
                                offset: { type: "minus", value: { days: 0 } } // checks for wearing adherence the last 6 days
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
];

export {taskList as MyTaskList};