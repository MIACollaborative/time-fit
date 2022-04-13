import { DateTime } from "luxon";
import prisma from "./prisma.mjs";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class MyUtility {
    //client;

    static taskList = [
        {
            label: "Testing task",// we need to manually make sure that it is unique
            index: 1, // we need to programmatically make sure that this is unique
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
                type: "list", // all or group or list
                membership: { // only matter if type is "group"
                    gif: [true],
                    salience: [],
                    modification: []
                },
                list:["test1", "test2"] // user name list, only matter if type is "list"
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
                            messageGroup: "test", // "nongif-m", // messageGroup, only matter if the type is messageGroup
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

    static async findMessageByLabel(mLabel){
        console.log(`MyUtility.findMessageByLabel: ${mLabel}`);
        const message = await prisma.message.findFirst({
            where: { label: mLabel},
        });
        console.log(`MyUtility.findMessageByLabel message: ${JSON.stringify(message)}`);
        return message;
    }

    static async findMessageByGroup(gGroupName, avoidHistory=false, username=""){

        console.log(`MyUtility.findMessageByGroup: ${gGroupName}, avoidHistory: ${avoidHistory}`);

        let messageList = [];



        if( avoidHistory ){
            messageList = (await MyUtility.getUserMessageFromGroupWithLowestFrequency(username, gGroupName)).map((item) => {
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
        
        
        
        console.log(`MyUtility.findMessageByGroup messageList.length: ${messageList.length}`);
        // now, how do I record the history and avoid it?

        let randomIndex = Math.floor(messageList.length * Math.random());

        console.log(`MyUtility.findMessageByGroup randomIndex: ${randomIndex}`);
        



        let pickedMessage = messageList[randomIndex];

        console.log(`MyUtility.findMessageByGroup pickedMessage: ${JSON.stringify(pickedMessage)}`);



        // To Do: support avoidHistory



        return pickedMessage;
    }

    static replacePlaceholderFromMessage(message, userInfo, surveyLink){
        let result = {
            nameReplaced: false,
            surveyReplaced: false,
            message: message
        };

        if( result.message.includes("[name]")){
            console.log(`MyUtility.replacePlaceholderFromMessage found [name]`);
            result.message = result.message.replaceAll("[name]", userInfo.preferredName);
            result.nameReplaced = true;
        }

        if( result.message.includes("<link>")){
            console.log(`MyUtility.replacePlaceholderFromMessage found <link>`);
            result.message = result.message.replaceAll("<link>", surveyLink);
            result.surveyReplaced = true;
        }
        

        return result;
    }

    static composeUserMessageForTwilio(userInfo, messageInfo, surveyURL){
        let result = "";

        // To Do: need to handle template for preferredName and survey link later

        if(messageInfo["interventionMessage"] != undefined && messageInfo["interventionMessage"].length > 0){
            result += messageInfo["interventionMessage"] + " ";
        }

        if(messageInfo["walkMessage"] != undefined && messageInfo["walkMessage"].length > 0){
            result += messageInfo["walkMessage"] + " ";
        }

        let placeholderReplaceResult = MyUtility.replacePlaceholderFromMessage(result, userInfo, surveyURL);

        result = placeholderReplaceResult.message;

        if(placeholderReplaceResult.surveyReplaced == false){
            // now a randomSurvey
            result += `[Random survey]:${surveyURL}?study_code=${userInfo.username}`;
        }
        

        return result;
    }

    static async getUserMessageFromGroupWithLowestFrequency(username, groupName){
        //let resultList = [];

        let frequencyDict = await MyUtility.getUserMessageFromGroupCountDict(username, groupName);

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

        let userMessageCountDict = await MyUtility.getCurrentUserMessageCountDict(username);
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
}