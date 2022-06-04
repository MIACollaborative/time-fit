import { DateTime } from "luxon";
import voca from 'voca';
import prisma from "./prisma.mjs";
import FitbitHelper from "./FitbitHelper.mjs";
import GeneralUtility from "./GeneralUtility.mjs";
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

    static async queryAndStoreFitbitHeartRateAtTargetDateForUser(userInfo, targetDate, insertToDB=true){
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

}