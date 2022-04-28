import { DateTime } from "luxon";
import voca from 'voca';

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class GeneralUtility {
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


    static replacePlaceholderFromMessage(message, userInfo, surveyLink){
        let result = {
            nameReplaced: false,
            surveyReplaced: false,
            message: message
        };

        if( result.message.includes("[name]")){
            console.log(`GeneralUtility.replacePlaceholderFromMessage found [name]`);
            result.message = voca.replaceAll(result.message, '[name]', userInfo.preferredName); 
            result.nameReplaced = true;
        }

        if( result.message.includes("<link>")){
            console.log(`GeneralUtility.replacePlaceholderFromMessage found <link>`);
            let surveySeg = `${surveyLink}?study_code=${userInfo.username}`;
            result.message = voca.replaceAll(result.message, '<link>', surveySeg); 
            result.surveyReplaced = true;
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

    static composeUserMessageForTwilio(userInfo, messageInfo, surveyURL=""){
        let result = "";

        // To Do: need to handle template for preferredName and survey link later

        if(messageInfo["interventionMessage"] != undefined && messageInfo["interventionMessage"].length > 0){
            result += messageInfo["interventionMessage"] + " ";
        }

        if(messageInfo["walkMessage"] != undefined && messageInfo["walkMessage"].length > 0){
            result += messageInfo["walkMessage"] + " ";
        }

        // surveyType: "surveyLink", //surveyLabel or surveyLink
        // surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6EkGW2OdbOd7ltQ"

        /*
        if(messageInfo["surveyType"] != undefined && messageInfo["surveyType"].length > 0){
            if( messageInfo["surveyType"] == "surveyLink"){
                result += messageInfo["surveyLink"] + " ";
            }
        }
        */

        let placeholderReplaceResult = GeneralUtility.replacePlaceholderFromMessage(result, userInfo, surveyURL);

        result = placeholderReplaceResult.message;

        if(placeholderReplaceResult.surveyReplaced == false && surveyURL.length > 0){
            // now a randomSurvey
            result += `${surveyURL}?study_code=${userInfo.username} .`;
        }
        

        return result;
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

        let result = `gif: ${userInfo.gif}, salience: ${userInfo.salience}, modification: ${userInfo.modification}, weekdayWakeup: ${userINfo.weekdayWakeup}, weekendWakeup: ${userInfo.weekendWakeup}, timesonze: ${userInfo.timezone}`;
        return result;
    }

    static doesFitbitInfoExist(userInfo){
        
        if(userInfo == null){
            return false;
        }

        return userInfo.fitbitId != null && userInfo.fitbitId.length > 0 && userInfo.accessToken != null && userInfo.accessToken.length > 0 && userInfo.refreshToken != null && userInfo.refreshToken.length > 0

    }
}