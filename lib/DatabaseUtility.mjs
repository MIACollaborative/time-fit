import { DateTime } from "luxon";
import voca from 'voca';
import prisma from "./prisma.mjs";
import FitbitHelper from "./FitbitHelper.mjs";
import GeneralUtility from "./GeneralUtility.mjs";
import { inspect } from 'util';
import v from "voca";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}
export default class DatabaseUtility {

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

    static async composeUserMessageForTwilio(userInfo, messageInfo, surveyURL=""){
        console.log(`${this.name} composeUserMessageForTwilio: userInfo: ${userInfo}, messageInfo: ${messageInfo}, surveyURL: ${surveyURL}`);
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

        let placeholderReplaceResult = await DatabaseUtility.replacePlaceholderFromMessage(result, userInfo, surveyURL);

        result = placeholderReplaceResult.message;

        if(placeholderReplaceResult.surveyReplaced == false && surveyURL.length > 0){
            // now a randomSurvey
            result += `${surveyURL}?study_code=${userInfo.username} .`;
        }


        return result;
    }

    static async replacePlaceholderFromMessage(message, userInfo, surveyLink){
        let result = {
            nameReplaced: false,
            surveyReplaced: false,
            message: message
        };

        if( result.message.includes("[name]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [name]`);
            result.message = voca.replaceAll(result.message, '[name]', userInfo.preferredName); 
            result.nameReplaced = true;
        }

        if( result.message.includes("<link>")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found <link>`);
            let surveySeg = `${surveyLink}?study_code=${userInfo.username}`;
            result.message = voca.replaceAll(result.message, '<link>', surveySeg); 
            result.surveyReplaced = true;
        }

        // [name], here is your weekly summary for this past week: You have walked [7-day-average-steps] steps on average each day, and went for a total of [7-day-walks-over-10mins] sustained walks for over 10 minutes this past week. Keep up the good work!

        if( result.message.includes("[7-day-average-steps]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [7-day-average-steps]`);
            let lastWeekInterval = GeneralUtility.getLastWeekAsInterval();
            
            let value = await DatabaseUtility.getUserFitbitAverageDailyStepsDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());
            let restrictedValue = value.toFixed(1);
            result.message = voca.replaceAll(result.message, '[7-day-average-steps]', restrictedValue); 
            result.surveyReplaced = true;
        }

        if( result.message.includes("[7-day-walks-over-10mins]")){
            console.log(`DatabaseUtility.replacePlaceholderFromMessage found [7-day-walks-over-10mins]`);
            let lastWeekInterval = GeneralUtility.getLastWeekAsInterval();
            
            let walkActivityList = await DatabaseUtility.getUserFitbitWalkActivityListDuringPeriodById(userInfo.fitbitId, lastWeekInterval.start.toISODate(), lastWeekInterval.end.toISODate());

            let filteredWalkList = GeneralUtility.filterFitbitWalkActivityListByDuration(walkActivityList, 10 * 60);

            result.message = voca.replaceAll(result.message, '[7-day-walks-over-10mins]', filteredWalkList.length); 
            result.surveyReplaced = true;
        }

        // this should be generalized, but will deal with it as a special case for now
        let matchList = GeneralUtility.matchSqureBracketPlaceholder(result.message);

        for(let i = 0; i < matchList.length; i++){
            let match = matchList[i];
            // [response_surveyId_last]

            if(v.startsWith(match, 'response', 1)){
                // [response...]
                let trimmedString = v.trim(v.trim(match, "["), "]");
                console.log(`trimmedString: ${trimmedString}`);

                let mSplit = trimmedString.split("|");
                let surveyId = mSplit[1];

                // asssuming mSplit[2] == last for now

                let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, DateTime.now().minus({years: 1}), DateTime.utc(), 1);

                console.log(`responseList: ${responseList}`);

                // if there is, then only 1 is returend, otherwise, it would be empty
                // content
                let lastResponse = "";

                if(responseList.length > 0){
                    lastResponse = responseList[0]["content"];
                }

                console.log(`lastResponse: ${lastResponse}`);

                result.message = voca.replaceAll(result.message, match, lastResponse);

                result.surveyReplaced = true;


            }
        }

        

        return result;
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

    static async getUserFitbitWalkActivityListDuringPeriodById(fitbitId, startDateString, endDateString){

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}`);


        let recordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString);

        let activityList = [];



        recordList.forEach((record) => {
            if(record.content.activities.length > 0){
                activityList = activityList.concat(record.content.activities);
            }
        });

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById activityList: ${activityList}`);

        let walkActivityList = activityList.filter((item) => {
            return item.activityParentName == "Walk";
        });

        console.log(`${this.name} getUserFitbitWalkActivityListDuringPeriodById walkActivityList: ${JSON.stringify(walkActivityList)}`);

        return walkActivityList;
    }

    static async getUserFitbitAverageDailyStepsDuringPeriodById(fitbitId, startDateString, endDateString){
        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById fitbitId: ${fitbitId}, start: ${startDateString}, end:${endDateString}`);


        let averageSteps = 0;

        let recordList = await DatabaseUtility.getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString);

        let stepsList = recordList.map((record) => {
            if(record.content.summary != undefined){
                return record.content.summary.steps;
            }
            else{

                console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById recoord (no content summary): ${JSON.stringify(record, null, 2)}`);
                return 0;
            }
            
        });

        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById stepsList: ${stepsList}`);

        let sum = stepsList.reduce((partialSum, a) => partialSum + a, 0);

        console.log(`${this.name} getUserFitbitAverageDailyStepsDuringPeriodById sum: ${sum}`);

        averageSteps = stepsList.length > 0 ? sum/stepsList.length: 0;

        return averageSteps;
    }

    static async getUserFitbitActivityDataDuringPeriodById(fitbitId, startDateString, endDateString){

        let recordList = await prisma.fitbit_data.findMany({
            where:{
                ownerId: fitbitId,
                dataType: "activities",
                dateTime: {
                    gte: startDateString,
                    lte: endDateString
                }
            }
        });

        return recordList;
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

    static async getFitbitUpdateByStatusWithLimit(status="notification", limit=50){
        console.log(`${this.name} getFitbitUpdateByStatusWithLimit: ${status}, limit=${limit}`);
        let updateList = await prisma.fitbit_update.findMany({
            where:{
                status: status
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        //console.log(`${this.name} getFitbitUpdateByStatusWithLimit: updateList=${JSON.stringify(updateList, null, 2)}`);
        

        return updateList;
    }

    static async isSurveyCompleted(surveyId){
        console.log(`${this.name }.isSurveyCompleted: ${surveyId}`);

        let startDate = DateTime.utc(2000);
        let endDate = DateTime.utc();

        let responseList = await DatabaseUtility.findSurveyResponseDuringPeriod(surveyId, startDate, endDate, 1);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return responseList.length > 0;
    }


    static async findSurveyResponseDuringPeriod(surveyId, startDate, endDate, limit=0){
        console.log(`${this.name }.findSurveyResponoseDuringPeriod: ${surveyId}, ${startDate}, ${endDate}`);

        let queryObj = {
            where: {
                surveyId: surveyId,
                dateTime: {
                    gte: startDate.toISO(),
                    lte: endDate.toISO()
                }
            },
            orderBy: [
                {
                    dateTime: 'desc',
                }
            ]
        };

        if(limit > 0){
            queryObj["take"] = limit;
        }

        let responseList = await prisma.response.findMany(queryObj);

        //responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));

        return responseList;
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

    static async ensureTokenValidForUser(userInfo, autoRefresh=false, minValidthresholdInSeconds=8 * 60 * 60){

        // version 1
        //let introspectResult = await FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);

        // version 2: myIntrospectToken
        /*
        return {type: "response", result: responseData};
        return {type: "error", result: error};
        */
        let introspectResult = undefined;
        console.log(`${this.name}.ensureTokenValidForUser: userInfo.accessToken: ${userInfo.accessToken}`);

        let myIntrospectResult = await FitbitHelper.myIntrospectToken(userInfo.accessToken, userInfo.accessToken);

        console.log(`${this.name}.ensureTokenValidForUser: myIntrospect result: ${JSON.stringify(myIntrospectResult, null, 2)}`);

        if(myIntrospectResult.type == "response"){
            introspectResult = myIntrospectResult.result;
        }
        else{
            // unhandledRejection: Error: Request failed with status code 401
            // need to refresh then
        }

        console.log(`${this.name}.ensureTokenValidForUser: introspect result: ${JSON.stringify(introspectResult, null, 2)}`);
        
        
        
        if (introspectResult != undefined && introspectResult.active == true){
            let expiredDate = DateTime.fromMillis(introspectResult["exp"]);
            let nowDate = DateTime.now();

            let diffInSeconds = expiredDate.diff(nowDate, 'seconds').toObject()["seconds"];
            console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}], threshold: [${minValidthresholdInSeconds}]`);



            // token is still valid
            if(autoRefresh == false){
                console.log(`${this.name}.ensureTokenValidForUser: autoRefresh: ${autoRefresh}`);
                return { value: "success", data: userInfo };
            }
            else {
                if(diffInSeconds > minValidthresholdInSeconds){
                    console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}] greater than the threshold: [${minValidthresholdInSeconds}] -> don't force refresh`);
                    return { value: "success", data: userInfo };
                }
                else{
                    console.log(`${this.name}.ensureTokenValidForUser: time to expire [${diffInSeconds}] less than the threshold: [${minValidthresholdInSeconds}] -> force refresh`);
                }
            }
        }

        // accessToken is not valid
        // or, diffInSeconds is small than the minimum tolerable threshold (too close to the expire time)
        const refreshResult = await FitbitHelper.refreshToken(userInfo.refreshToken)
        .then((responseData) => {
            console.log(
                `${this.name}.refreshToken: ${JSON.stringify(
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
            let updatedUserInfo = await DatabaseUtility.updateToken(userInfo.hash, refreshResult.data.accessToken, refreshResult.data.refreshToken, userInfo);

            return {value: "success", data: updatedUserInfo};
        }

        

        return refreshResult;
    }

    static async countSubscription(){
        const subCount = await prisma.fitbit_subscription.count();

        return subCount;
    }

    static async updateSameOrOlderFitbitUpdateStatusWithSameSignature(fUpdate, oldStatus="notification", newStatus="processed"){

        console.log(`${this.name}: updateOlderFitbitUpdateWithSameSignature: ${JSON.stringify(fUpdate, null, 2)}`);

        const updateOlderList = await prisma.fitbit_update.updateMany({
            where: {
                status: oldStatus,
                ownerId: fUpdate.ownerId,
                collectionType: fUpdate.collectionType,
                date: fUpdate.date,
                createdAt: {
                    lte: fUpdate.createdAt
                },
            },
            data: {
                status: newStatus,
            },
        });

        return updateOlderList;
    }

    static async updateUserInfo(userInfo, propertyValueObject){

        console.log(`${this.name}: updateUserInfo ${userInfo.username}:  ${JSON.stringify(propertyValueObject, null, 2)}`);

        const updateResult = await prisma.users.update({
            where: {
                username: userInfo.username,
            },
            data: {
                ...propertyValueObject
            },
        });

        return updateResult;
    }

    static async createSubscriptionsForUser(userInfo, collectionTypeList=["activities", "userRevokedAccess"]){
        console.log(`${this.name}.createSubscriptionsForUser: ${JSON.stringify(userInfo)}`);
        let resultList = [];

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
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

    static async queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, insertToDB=true, numOfDays=1){
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: ${userInfo.username}, ${targetDate}, numOfDays: ${numOfDays}`);

        // .toISODate() -> what will be used by FitbitHelper
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: targetDate.toISODate:, ${targetDate.toISODate()}`);


        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser: token validation: ${validateTokenResult.value}`);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // use updatedUserInfo from this point

        let resultList = [];
        // now query the data
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDate.plus({"days": i});

            let activityResult = await FitbitHelper.getActvitySummaryAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, curDate)
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
    
            console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser [${curDate.toFormat('yyyy-MM-dd')}]: query result: ${activityResult.value}`);
    
    
            if(insertToDB == true && activityResult.value == "success"){
                resultData = activityResult.data;
    
                // now insert the data
                // To Do: decide the schema
                let dataType = "activities";
    
                // targetDate.toISODate()
                let dateTime =  curDate.toISODate(); //resultData[dataType][0].startDate;
                let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
                let lastModified = resultData.activities.length > 0? resultData.activities[0].lastModified: "";
    
    
                let updateRecord = await prisma.fitbit_data.upsert({
                    where: {
                        compositeId: compositeId
                    },
                    update: {
                        lastModified: lastModified,
                        content: resultData
                    },
                    create: {
                        compositeId: compositeId,
                        dataType: dataType,
                        ownerId: updatedUserInfo.fitbitId,
                        dateTime: dateTime,
                        lastModified: lastModified,
                        content: resultData
                    },
                })
            }


            resultList.push(activityResult);

        }

        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${curResult.data} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };

        
    }

    static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true, numOfDays=1){
        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: ${userInfo.username}, ${targetDate}, numOfDays: ${numOfDays}`);

        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: token validation: ${validateTokenResult.value}`);

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


        let resultList = [];
        // now query the data
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDate.plus({"days": i});

            const activityResult = await FitbitHelper.getHeartRateAtDateForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, curDate)
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
    
    
            console.log(`${this.name}.queryAndStoreFitbitHeartRateAtTargetDateForUser: query result: ${activityResult.value}`);
    
    
            if(insertToDB == true && activityResult.value == "success"){
                resultData = activityResult.data;
    
                // now insert the data
                // To Do: decide the schema
                let dataType = "activities-heart";
                let dateTime = curDate.toISODate(); //resultData[dataType][0].dateTime;
                let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
                let lastModified = ""; // no this field for heart rate
    
                const updateRecord = await prisma.fitbit_data.upsert({
                    where: {
                        compositeId: compositeId
                    },
                    update: {
                        lastModified: lastModified,
                        content: resultData
                    },
                    create: {
                        compositeId: compositeId,
                        dataType: dataType,
                        ownerId: updatedUserInfo.fitbitId,
                        dateTime: dateTime,
                        lastModified: lastModified, 
                        content: resultData
                    },
                })
            }


            resultList.push(activityResult);

        }



        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${curResult.data} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };
        
    }

    static async queryAndStoreFitbitIntradayHeartRateAtTargetDateRangeForUser(userInfo, targetDateStart, targetDateEnd, insertToDB=true, numOfDays=1){
        console.log(`${this.name}.queryAndStoreFitbitIntradayHeartRateAtTargetDateRangeForUser: ${userInfo.username}, ${targetDate}, numOfDays: ${numOfDays}`);

        // .toISODate() -> what will be used by FitbitHelper
        console.log(`${this.name}.queryAndStoreFitbitIntradayHeartRateAtTargetDateRangeForUser: targetDateStart.toISODate:, ${targetDateStart.toISODate()}`);
        console.log(`${this.name}.queryAndStoreFitbitIntradayHeartRateAtTargetDateRangeForUser: targetDateEnd.toISODate:, ${targetDateEnd.toISODate()}`);


        let resultData = {};

        // validate user token first
        // { value: "success", data: userInfo };
        // { value: "failed", data: inspect(error.response.data) };
        let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(userInfo, true, 30 * 60);
        console.log(`${this.name}.queryAndStoreFitbitIntradayHeartRateAtTargetDateRangeForUser: token validation: ${validateTokenResult.value}`);

        let updatedUserInfo;

        if(validateTokenResult.value == "success"){
            updatedUserInfo = validateTokenResult.data;
        }
        else{
            // cannot update userInfo, need to abort
            return validateTokenResult;
        }

        // use updatedUserInfo from this point

        let resultList = [];
        // now query the data
        /*
        for(let i = 0; i < numOfDays; i++){
            let curDate = targetDateStart.plus({"days": i});



        }
        */

        let activityResult = await FitbitHelper.getIntradayHeartRateBetweenDateRangeForFitbitId(updatedUserInfo.fitbitId, updatedUserInfo.accessToken, targetDateStart, targetDateEnd)
        .then((responseData) => {
          console.log(
            `FitbitHelper.getIntradayHeartRateBetweenDateRangeForFitbitId: ${JSON.stringify(
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

        console.log(`${this.name}.queryAndStoreFitbitActivitySummaryAtTargetDateForUser [${curDate.toFormat('yyyy-MM-dd')}]: query result: ${activityResult.value}`);


        if(insertToDB == true && activityResult.value == "success"){
            resultData = activityResult.data;

            // now insert the data
            // To Do: decide the schema
            let dataType = "activities";

            // targetDate.toISODate()
            let dateTime =  curDate.toISODate(); //resultData[dataType][0].startDate;
            let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([updatedUserInfo.fitbitId, dataType, dateTime]);
            let lastModified = resultData.activities.length > 0? resultData.activities[0].lastModified: "";


            let updateRecord = await prisma.fitbit_data.upsert({
                where: {
                    compositeId: compositeId
                },
                update: {
                    lastModified: lastModified,
                    content: resultData
                },
                create: {
                    compositeId: compositeId,
                    dataType: dataType,
                    ownerId: updatedUserInfo.fitbitId,
                    dateTime: dateTime,
                    lastModified: lastModified,
                    content: resultData
                },
            })
        }


        resultList.push(activityResult);

        let resultStatus = "success";
        let resultErrorMessage = "";

        for(let i = 0 ; i < resultList.length; i++){
            let curResult = resultList[i];
            // one failed is failed
            if (curResult.value == "failed"){
                resultStatus = "failed";
                resultErrorMessage += `${curResult.data} - `;
            }
        }

        //return activityResult;
        //return resultList;

        return {
            value: resultStatus,
            data: resultErrorMessage
        };

        
    }


    static async queryAndStoreFitbitDataByFitbitUpdate(fitbitUpdate, insertToDB=true){
        console.log(`${this.name}.queryAndStoreFitbitDataByFitbitUpdate: ${JSON.stringify(fitbitUpdate)}`);

        let resultData = {};

        // get the user first
        let userInfo = await prisma.users.findFirst({
            where: {
                fitbitId: fitbitUpdate.ownerId
            }
        });

        let dateString = fitbitUpdate.date;
        let targetDate = DateTime.fromISO(fitbitUpdate.date);

        console.log(`${this.name}.queryAndStoreFitbitDataByFitbitUpdate userInfo: ${JSON.stringify(userInfo)}`);

        const summaryResult = await DatabaseUtility.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(userInfo, targetDate, insertToDB, 1);
        
        
        //const heartrateResult = await DatabaseUtility.queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB, 1);

        //let resultStatus = summaryResult.value == "success" && heartrateResult.value == "success" ? "success" : "failed";

        let resultStatus = summaryResult.value == "success" ? "success" : "failed";

        let resultErrorMessage = "";
        if (summaryResult.value == "failed") {
            resultErrorMessage += `${summaryResult.data}`;
        }
        /*
        if (heartrateResult.value == "failed") {
            resultErrorMessage += `${heartrateResult.data}`;
        }
        */

        //let compositeId = GeneralUtility.generateCompositeIDForFitbitUpdate([fitbitUpdate.ownerId, fitbitUpdate.collectionType, fitbitUpdate.date]);

        return {
            value: resultStatus,
            data: resultErrorMessage,
            update: fitbitUpdate,
            body: [{
                value: summaryResult.value,
                ownerId: userInfo.fitbitId,
                dataType: "activities",
                dateTime: dateString
            }
            /*
            , {
                value: heartrateResult.value,
                ownerId: userInfo.fitbitId,
                dataType: "activities-heart",
                dateTime: dateString
            }
            */
        ]
        };
    }

}