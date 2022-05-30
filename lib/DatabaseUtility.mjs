import { DateTime } from "luxon";
import voca from 'voca';
import prisma from "./prisma.mjs";
import FitbitHelper from "./FitbitHelper.mjs";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class DatabaseUtility {
    //client;

    static taskList = [
        {
            label: "wakeupTime message",// we need to manually make sure that it is unique
            enabled: false,
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
        },
        {
            label: "bedTime message",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_1",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_2",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_3",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_4",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_5",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_6",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_7",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        },
        {
            label: "soo-scenario_8",// we need to manually make sure that it is unique
            enabled: false,
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
            preCondition:{}
        }
    ];

    constructor() {

    }
    static async findMessageByLabel(mLabel){
        console.log(`DatabaseUtility.findMessageByLabel: ${mLabel}`);
        const message = await prisma.message.findFirst({
            where: { label: mLabel},
        });
        console.log(`DatabaseUtility.findMessageByLabel message: ${JSON.stringify(message)}`);
        return message;
    }

    static async findMessageByGroup(gGroupName, avoidHistory=false, username=""){

        console.log(`DatabaseUtility.findMessageByGroup: ${gGroupName}, avoidHistory: ${avoidHistory}`);

        let messageList = [];



        if( avoidHistory ){
            messageList = (await DatabaseUtility.getUserMessageFromGroupWithLowestFrequency(username, gGroupName)).map((item) => {
                return item.info;
            });
        }
        else{
            messageList = await prisma.message.findMany({
                where: { group: gGroupName},
                orderBy: [
                    {
                      groupIndex: 'asc',
                    }
                  ],
            });
        }
        
        
        
        console.log(`DatabaseUtility.findMessageByGroup messageList.length: ${messageList.length}`);
        // now, how do I record the history and avoid it?

        let randomIndex = Math.floor(messageList.length * Math.random());

        console.log(`DatabaseUtility.findMessageByGroup randomIndex: ${randomIndex}`);
        



        let pickedMessage = messageList[randomIndex];

        console.log(`DatabaseUtility.findMessageByGroup pickedMessage: ${JSON.stringify(pickedMessage)}`);



        // To Do: support avoidHistory



        return pickedMessage;
    }

    static async getUserMessageFromGroupWithLowestFrequency(username, groupName){
        //let resultList = [];

        let frequencyDict = await DatabaseUtility.getUserMessageFromGroupCountDict(username, groupName);

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

    static async getUserMessageFromGroupCountDict(username, groupName){
        const groupMessages = await prisma.message.findMany({
            where: {
                group: {
                    equals: groupName,
                },
            },
        });

        console.log(`getUserMessageFromGroupCountDict.groupMessages:${JSON.stringify(groupMessages)}`);

        let messageLabelList = groupMessages.map((messageInfo) => {return messageInfo.label;});

        let userMessageCountDict = await DatabaseUtility.getCurrentUserMessageCountDict(username);
        let resultDict = {};

        console.log(`getUserMessageFromGroupCountDict.userMessageCountDict:${JSON.stringify(userMessageCountDict)}`);

        groupMessages.forEach((messageInfo) => {
            let messageLabel = messageInfo["label"];

            if(userMessageCountDict[messageLabel] != undefined){
                resultDict[messageLabel] = {
                    info: messageInfo,
                    count: userMessageCountDict[messageLabel]
                };
            }
            else{
                resultDict[messageLabel] = {
                    info: messageInfo,
                    count: 0
                };
            }


        })

        console.log(`resultDict: ${JSON.stringify(resultDict)}`);

        return resultDict;
    }

    static async getCurrentUserMessageCountDict(username){
        const results = await prisma.taskLog.groupBy({
            by: ['messageLabel'],
            where: {
                username: {
                    equals: username,
                },
            },
            _count: {
                messageLabel: true,
            },
        });
        
        
        let resultList = JSON.parse(JSON.stringify(results, replacer));
    
        console.log(`getCurrentUserMessageCountDict resultList: ${JSON.stringify(resultList, null, 2)}`);
    
    
        let resultDict = {};
    
        resultList.forEach((result) => {
    
            /*()
            {
                "_count": {
                  "messageLabel": 1
                },
                "messageLabel": "nongif-m_23"
              }
            */
    
            if (result["messageLabel"] != null){
                resultDict[result["messageLabel"]] = result["_count"]["messageLabel"];
            }
        });
    
        return resultDict;
    }

    static async getUsersWithLessThanCertainSubscritions(threshold=2){

        let userList = await prisma.users.findMany({
            include: {
                fitbitSubscriptionList: true
            },
        })
        
        userList = userList.filter((userInfo) => {
            console.log(`user[${userInfo.username}] fitbitSubscriptionList.length: ${userInfo.fitbitSubscriptionList.length}`);
            return userInfo.fitbitSubscriptionList.length < threshold;
        });

        return userList;
    }

    static async updateToken(hashCode, accessToken, refreshToken, userInfo=null) {
        console.log(`updateToken, hashCode: ${hashCode}`);
        console.log(`updateToken, accessToken: ${accessToken}`);
        console.log(`updateToken, refreshToken: ${refreshToken}`);

        let theUser;

        if(userInfo == null){
            theUser = await prisma.users.findFirst({
                where: { hash: hashCode },
            });
        }
        else{
            theUser = userInfo;
        }

        console.log(`theUser: ${JSON.stringify(theUser)}`);
    
        const updatedUser = await prisma.users.update({
            where: { username: theUser.username },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    
        console.log(`updatedUser: ${JSON.stringify(updatedUser)}`);

        return updatedUser;
    }

    static async refreshAndUpdateTokenForUser(userInfo){
        console.log(`${this.name}.refreshAndUpdateTokenForUser: userInfo: ${userInfo.username}`);
        let newAccessToken;
        let newRefreshToken;

        const refreshResult = await FitbitHelper.refreshToken(userInfo.refreshToken)
        .then((responseData) => {
            console.log(
                `responseData: ${JSON.stringify(
                    responseData
                )}`
            );

            /*
            if(responseData.status == 400){
                // cannot auth: Bad Request
                // I supposed this mean we need to authenticate again
            }
            */


            /*
            {
              "access_token": "eyJhbGciOiJIUzI1...",
              "expires_in": 28800,
              "refresh_token": "c643a63c072f0f05478e9d18b991db80ef6061e...",
              "token_type": "Bearer",
              "user_id": "GGNJL9"
            }
            */

            newAccessToken = responseData.access_token;

            // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
            newRefreshToken = responseData.refresh_token;

            // To Do: ideally, store both
            //updateToken(user.hash, newAccessToken, newRefreshToken);

            return { type: "response", result: {...userInfo, accessToken: newAccessToken, refreshToken: newRefreshToken} };
            //return { value: "success", data: responseData };

            //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);

                console.log(`Error response`);
                // which means, authentication falil
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);

                console.log(`Error request`);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);

                console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            return { type: "error", result: inspect(error.response.data) };
        });

        if(refreshResult.type == "response"){
            // need to actually update the token
            let updatedUserInfo = await DatabaseUtility.updateToken(userInfo.hash, newAccessToken, newRefreshToken, userInfo);

            return {value: "success", data: updatedUserInfo};
        }
        else{
            return {value: "failsed", data: refreshResult};
        }
    }

    static async ensureTokenValidForUser(userInfo){
        let introspectResult = await FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);

        if (introspectResult.active == true){
            // token is valid
            return { value: "success", data: userInfo };
        }

        // accessToken is not valid
        const refreshResult = await FitbitHelper.refreshToken(userInfo.refreshToken)
        .then((responseData) => {
            console.log(
                `DatabaseUtility.refreshToken: ${JSON.stringify(
                    responseData
                )}`
            );

            /*
            if(responseData.status == 400){
                // cannot auth: Bad Request
                // I supposed this mean we need to authenticate again
            }
            */


            /*
            {
              "access_token": "eyJhbGciOiJIUzI1...",
              "expires_in": 28800,
              "refresh_token": "c643a63c072f0f05478e9d18b991db80ef6061e...",
              "token_type": "Bearer",
              "user_id": "GGNJL9"
            }
            */

            let newAccessToken = responseData.access_token;

            // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
            let newRefreshToken = responseData.refresh_token;



            return { value: "success", data: {...userInfo, accessToken: newAccessToken, refreshToken: newRefreshToken} };

            //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);

                console.log(`Error response`);
                // which means, authentication falil
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);

                console.log(`Error request`);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);

                console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            return { value: "failed", data: inspect(error.response.data) };
        });

        if(refreshResult.value == "success"){
            // need to actually update the token
            let updatedUserInfo = await DatabaseUtility.updateToken(userInfo.hash, newAccessToken, newRefreshToken, userInfo);

            return {value: "success", data: updatedUserInfo};
        }

        

        return refreshResult;
    }

    static async countSubscription(){
        const subCount = await prisma.fitbit_subscription.count();

        return subCount;
    }

    static async createSubscriptionsForUser(userInfo, collectionTypeList=["activities", "userRevokedAccess"]){
        console.log(`DatabaseUtility.createSubscriptionsForUser: ${JSON.stringify(userInfo)}`);
        let resultList = [];

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return resultList;
        }

        for(let i = 0; i < collectionTypeList.length; i++){
            let cType = collectionTypeList[i];
            console.log(`DatabaseUtility.createSubscriptionsForUser: collection: ${cType}`);
            // now, need to determine the subscriptionId
            // count the number of subscription and increase by 1


            // An optional identifier to refer to this subscriber. If none specified, we assign one for you (starting with 1,2,3...) Subscriber IDs may be up to 50 unicode characters long. Fitbit encourages you to choose an ID that makes the most sense to you.


            let currentSubCount = await DatabaseUtility.countSubscription();

            let newSubscriptionId = `${updatedUserInfo.fitbitId}-${cType}-${currentSubCount + 1}`;

            // now, create subscription
            // example result
            /*
            {
                "collectionType":"activities",
                "ownerId":"GGNJL9",
                "ownerType":"user",
                "subscriberId":"1",
                "subscriptionId":"320"
            }
            */

            let subscriptionResult = await FitbitHelper.createSubscriptionForFitbitId(updatedUserInfo.fitbitId, cType, newSubscriptionId, updatedUserInfo.accessToken);

            await prisma.fitbit_subscription.create({
                data: subscriptionResult
            });

            resultList.push(subscriptionResult);

            console.log(`DatabaseUtility.createSubscriptionsForUser: subscriptionResult: ${JSON.stringify(subscriptionResult)}`);
        }

        return resultList;
    }

    static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true){
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: ${userInfo.username}, ${targetDate}`);

        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // use updatedUserInfo from this point

        // now query the data
        const activityResult = await FitbitHelper.getActvitySummaryAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, targetDate)
        .then((responseData) => {
          console.log(
            `FitbitHelper.getActvitySummaryAtDateForFitbitId: ${JSON.stringify(
              responseData
            )}`
          );
    
          /*
          if(responseData.status == 400){
              // cannot auth: Bad Request
              // I supposed this mean we need to authenticate again
          }
          */
    
          //accessToken = responseData.access_token;
    
          // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
          //refreshToken = responseData.refresh_token;
    
          // To Do: ideally, store both
          //updateToken(hashCode, accessToken, refreshToken);
    
          return {value: "success", data: responseData};
    
          //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(`Data: ${error.response.data}`);
            console.log(`Status: ${error.response.status}`);
            console.log(`StatusText: ${error.response.statusText}`);
            console.log(`Headers: ${error.response.headers}`);
    
            console.log(`Error response`);
            // which means, authentication falil
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
    
            console.log(`Error request`);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
    
            console.log("Error else");
          }
          //res.status(error.response.status).json({ response: inspect(error.response.data) });
    
          let resultObj = eval(`(${inspect(error.response.data)})`);
          return {value: "failed", data: resultObj};
        });


        if(insertToDB == true && activityResult.value == "success"){
            resultData = activityResult.data;

            // now insert the data
            // To Do: decide the schema
            let dataType = "activities";
            let dateTime = resultData[dataType][0].dateTime;
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);

            const updateRecord = await prisma.fitbit_data.upsert({
                where: {
                    compositeId: compositeId
                },
                update: {
                    lastModified: resultData.activities[0].lastModified,
                    content: resultData
                },
                create: {
                    compositeId: compositeId,
                    dataType: dataType,
                    ownerId: updatedUserInfo.fitbitId,
                    startDate: resultData.activities[0].startDate,
                    lastModified: resultData.activities[0].lastModified,
                    content: resultData
                },
            })
            /*
            await prisma.fitbit_data.create({
                data: {
                    type: "activity-summary",
                    ownerId: updatedUserInfo.fitbitId,
                    startDate: data.activities[0].startDate,
                    lastModified: data.activities[0].lastModified,
                    content: resultData
                }
            });
            */

        }
        /*
        else if(activityResult.value == "failed" && activityResult.errors[0].message.includes("Authorization Error")){
            //hasAuthorizationError = true;
        }
        */


        return activityResult;
    }

    static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true){
        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: ${userInfo.username}, ${targetDate}`);

        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // use updatedUserInfo from this point

        // now query the data
        const activityResult = await FitbitHelper.getHeartRateAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, targetDate)
        .then((responseData) => {
          console.log(
            `FitbitHelper.getHeartRateAtDateForFitbitId: ${JSON.stringify(
              responseData
            )}`
          );
    
          /*
          if(responseData.status == 400){
              // cannot auth: Bad Request
              // I supposed this mean we need to authenticate again
          }
          */
    
          //accessToken = responseData.access_token;
    
          // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
          //refreshToken = responseData.refresh_token;
    
          // To Do: ideally, store both
          //updateToken(hashCode, accessToken, refreshToken);
    
          return {value: "success", data: responseData};
    
          //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(`Data: ${error.response.data}`);
            console.log(`Status: ${error.response.status}`);
            console.log(`StatusText: ${error.response.statusText}`);
            console.log(`Headers: ${error.response.headers}`);
    
            console.log(`Error response`);
            // which means, authentication falil
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
    
            console.log(`Error request`);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
    
            console.log("Error else");
          }
          //res.status(error.response.status).json({ response: inspect(error.response.data) });
    
          let resultObj = eval(`(${inspect(error.response.data)})`);
          return {value: "failed", data: resultObj};
        });


        if(insertToDB == true && activityResult.value == "success"){
            resultData = activityResult.data;

            // now insert the data
            // To Do: decide the schema
            let dataType = "activities-heart";
            let dateTime = resultData[dataType][0].dateTime;
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);

            const updateRecord = await prisma.fitbit_data.upsert({
                where: {
                    compositeId: compositeId
                },
                update: {
                    lastModified: resultData.activities[0].lastModified,
                    content: resultData
                },
                create: {
                    compositeId: compositeId,
                    dataType: dataType,
                    ownerId: updatedUserInfo.fitbitId,
                    startDate: resultData.activities[0].startDate,
                    lastModified: resultData.activities[0].lastModified,
                    content: resultData
                },
            })
            /*
            await prisma.fitbit_data.create({
                data: {
                    type: "activity-summary",
                    ownerId: updatedUserInfo.fitbitId,
                    startDate: data.activities[0].startDate,
                    lastModified: data.activities[0].lastModified,
                    content: resultData
                }
            });
            */

        }
        /*
        else if(activityResult.value == "failed" && activityResult.errors[0].message.includes("Authorization Error")){
            //hasAuthorizationError = true;
        }
        */


        return activityResult;
    }

}