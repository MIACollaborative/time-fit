import axios from "axios";
import GeneralUtility from "./GeneralUtility.mjs";


/*
import pkg from "luxon";
const { DataTime } = pkg;
*/

import { DateTime } from "luxon";

//import prisma from "./prisma";

const basicToken = "MjM4MjlYOjA0ZTIwYzZkY2U0YTg1MjcyZWJkOTljZjQ3M2UzODA5";
export default class FitbitHelper {
  //client;

  constructor() {
    //this.client = new MongoClient(uri);
  }

  testConnection() {
    console.log(`FitbitHelper.testConnection`);
  }

  static async getAuthorizationInformation(authCode) {
    return axios({
      method: "post",
      url: "https://api.fitbit.com/oauth2/token",
      // `headers` are custom headers to be sent
      headers: {
        // now sure where this comes from?
        Authorization: `Basic ${basicToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        clientId: "23829X",
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL}/fitbit-signin`,
        code: authCode,
      },
    }).then((response) => {
      //console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      //console.log(response.headers);
      //console.log(response.config);

      let data = response.data;
      return data;
    });
  }

  static async getProfile(accessToken) {
    console.log(`${this.name}.getProfile: accessToken: ${accessToken}`);
    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/-/profile.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      //data: {}
    }).then((response) => {
      let profileData = response.data;

      return profileData;
    });
  }

  static async refreshToken(refreshToken) {
    console.log(`${this.name}.refreshToken: refreshToken: ${refreshToken}`);

    /*
    curl -X POST "https://api.fitbit.com/oauth2/token" \
-H "accept: application/json" \
-H "authorization: Basic <basic_token>" \
-d "grant_type=refresh_token&refresh_token=<refresh_token>"
    */

    return axios({
      method: "post",
      url: `https://api.fitbit.com/oauth2/token`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Basic ${basicToken}`,
        Accept: `application/json`,
      },
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      //data: {}
    }).then((response) => {
      let responseData = response.data;

      return responseData;
    });
  }

  static async introspectToken(accessToken, inspectToken) {
    console.log(`${this.name}.inspectToken: inspectToken: ${inspectToken}`);

    /*
    curl -X POST "https://api.fitbit.com/1.1/oauth2/introspect" \
-H "accept: application/json" \
-H "authorization: Bearer <access_token> \" 
-d "token=<The OAuth 2.0 token to retrieve the state>"
    */

    return axios({
      method: "post",
      url: `https://api.fitbit.com/1.1/oauth2/introspect`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type: application/x-www-form-urlencoded
        Accept: `application/json`,
        "Content-Type": `application/x-www-form-urlencoded`,
      },
      /*
        params: {
          'token': inspectToken
        },
        */
      // Note, the {'token': inspectToken} approach won't work!
      data: `token=${inspectToken}`, //{'Token': inspectToken}
    }).then((response) => {
      let responseData = response.data;
      console.log(
        `FitbitHelper.introspectToken: ${JSON.stringify(responseData)}`
      );

      /*
        {
          "active":true,
          "scope":"{ACTIVITY=READ_WRITE}",
          "client_id":"<Client Id>",
          "user_id":"<User Id>",
          "token_type":"access_token",
          "exp":<expiration date>,
          "iat":<issued date>
      }
      
      
      or
      
      
      {
        "active": false
      }
      */

      return responseData;
    });
  }

  static async myIntrospectToken(accessToken, inspectToken) {
    console.log(
      `${this.name}.myIntrospectToken: inspectToken: ${inspectToken}`
    );

    // Active Response
    // {"active":true,"scope":"{PROFILE=READ, ACTIVITY=READ, SETTINGS=READ}","client_id":"23829X","user_id":"4SW9W9","token_type":"access_token","exp":1651145502000,"iat":1651116702000}

    // Error Response
    /*
 {
  "message": "Request failed with status code 401",
  "name": "Error",
  "stack": "Error: Request failed with status code 401\n    at createError (/home/patrickretset/walktojoy-next/node_modules/axios/lib/core/createError.js:16:15)\n    at settle (/home/patrickretset/walktojoy-next/node_modules/axios/lib/core/settle.js:17:12)\n    at IncomingMessage.handleStreamEnd (/home/patrickretset/walktojoy-next/node_modules/axios/lib/adapters/http.js:322:11)\n    at IncomingMessage.emit (node:events:532:35)\n    at endReadableNT (node:internal/streams/readable:1346:12)\n    at processTicksAndRejections (node:internal/process/task_queues:83:21)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzgyOVgiLCJzdWIiOiI5Qks0Q1MiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc2V0IHJhY3QgcnBybyIsImV4cCI6MTY0NzU2MDI0MiwiaWF0IjoxNjQ3NTMxNDQyfQ.vMTJyOAA8zM0-MLnwXjaJgGDKZ87evefBL0qrtORkoQ",
      "User-Agent": "axios/0.26.1",
      "Content-Length": 241
    },
    "method": "post",
    "url": "https://api.fitbit.com/1.1/oauth2/introspect",
    "data": "token=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzgyOVgiLCJzdWIiOiI5Qks0Q1MiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc2V0IHJhY3QgcnBybyIsImV4cCI6MTY0NzU2MDI0MiwiaWF0IjoxNjQ3NTMxNDQyfQ.vMTJyOAA8zM0-MLnwXjaJgGDKZ87evefBL0qrtORkoQ"
  },
  "status": 401
}
*/

    let introspectTokenResult = await FitbitHelper.introspectToken(
      accessToken,
      inspectToken
    )
    .then((responseData) => {
        console.log(`Access token active?: ${responseData.active}`);
        return {type: "response", result: responseData};
      })
      .catch((error) => {
        return {type: "error", result: error};
      });
    
    return introspectTokenResult;
  }

  static async getActivityGoalsForFitbitID(encodedId, accessToken, periodString="daily") {
    console.log(
      `${this.name}.getActivityGoalsForFitbitID: fitbitId: ${encodedId}, accessToken: ${accessToken}, periodString: ${periodString}`
    );

    // example response for daily goals
    // reference: https://dev.fitbit.com/build/reference/web-api/activity/get-activity-goals/

    /*
    {
      "goals": {
          "activeMinutes": 55,
          "activeZoneMinutes": 21,
          "caloriesOut": 3500,
          "distance": 5,
          "floors": 10,
          "steps": 10000
      }
    }
    */

    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/${encodedId}/activities/goals/${periodString}.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      return response.data;
    });
  }

  static async setActivityGoalsForFitbitID(encodedId, accessToken, periodString="daily", category="steps", targetGoalValue=0) {
    console.log(
      `${this.name}.setActivityGoalsForFitbitID: fitbitId: ${encodedId}, accessToken: ${accessToken}, periodString: ${periodString}, category: ${category}, targetGoalValue: ${targetGoalValue}`
    );

    // example response for daily goals
    // reference: https://dev.fitbit.com/build/reference/web-api/activity/get-activity-goals/

    /*
    {
      "goals": {
          "activeMinutes": 55,
          "activeZoneMinutes": 21,
          "caloriesOut": 3500,
          "distance": 5,
          "floors": 10,
          "steps": 10000
      }
    }
    */

    // ${encodedId}
    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/${encodedId}/activities/goals/${periodString}.json?$type=${category}&value=${targetGoalValue}`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      return response.data;
    });
  }

  static async getActvitySummaryAtDateForFitbitId(encodedId, accessToken, dateTime) {
    console.log(
      `${this.name}.getActvitySummaryAtDateForFitbitId: fitbitId: ${encodedId}, accessToken: ${accessToken}, dateTime: ${dateTime.toISODate()}`
    );
    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/${encodedId}/activities/date/${dateTime.toISODate()}.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      return response.data;
    });
  }

  static async getHeartRateAtDateForFitbitId(encodedId, accessToken, dateTime, period="1d") {
    console.log(
      `${this.name}.getHeartRateAtDateForFitbitId: fitbitId: ${encodedId}, accessToken: ${accessToken}, dateTime: ${dateTime.toISODate()}`
    );
    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/${encodedId}/activities/heart/date/${dateTime.toISODate()}/${period}.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      return response.data;
    });
  }

  static async getIntradayDataBetweenDateRangeForFitbitId(encodedId, fitbitIntradayDataType, accessToken, dateTimeStart, dateTimeEnd, detailLevel="1min") {
    console.log(
      `${this.name}.getIntradayDataBetweenDateRangeForFitbitId: fitbitId: ${encodedId}, type: ${fitbitIntradayDataType}, accessToken: ${accessToken}, dateTimeStart: ${dateTimeStart.toISODate()}, dateTimeEnd: ${dateTimeEnd.toISODate()}`
    );

    // for heart
    // /1/user/[user-id]/activities/heart/date/[start-date]/[end-date]/[detail-level].json

    // /1/user/[user-id]/activities/heart/date/[start-date][end-date]/[detail-level]/time/[start-time]/[end-time].json

    // for step
    // /1/user/[user-id]/activities/[resource]/date/[start-date]/[end-date]/[detail-level].json

    // /1/user/[user-id]/activities/[resource]/date/[start-date][end-date]/[detail-level]/time/[start-time]/[end-time].json

    let endpointURL = "";

    if (fitbitIntradayDataType == GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_HEART){
      endpointURL = `https://api.fitbit.com/1/user/${encodedId}/activities/heart/date/${dateTimeStart.toISODate()}/${dateTimeEnd.toISODate()}/${detailLevel}.json`;
    }
    else if (fitbitIntradayDataType == GeneralUtility.FITBIT_INTRADAY_DATA_TYPE_STEP){
      endpointURL = `https://api.fitbit.com/1/user/${encodedId}/activities/steps/date/${dateTimeStart.toISODate()}/${dateTimeEnd.toISODate()}/${detailLevel}.json`;
    }

    return axios({
      method: "get",
      url: endpointURL,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      return response.data;
    });
  }

  

  static async createSubscriptionForFitbitId(
    fitbitId,
    collectionPath,
    subscriptionId,
    accessToken
  ) {
    console.log(
      `${this.name}.createSubscriptionForFitbitId: fitbitId: ${fitbitId}, collectionPath: ${collectionPath}, subscriptionId: ${subscriptionId}, accessToken: ${accessToken}`
    );
    // /1/user/[user-id]/[collection-path]/apiSubscriptions/[subscription-id].json

    return axios({
      method: "post",
      url: `https://api.fitbit.com/1/user/${fitbitId}/${collectionPath}/apiSubscriptions/${subscriptionId}.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      /*
      params: {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      }
      */
      //data: {}
    }).then((response) => {
      let responseData = response.data;

      console.log(`responseData: ${responseData}`);

      return responseData;
    })
    .catch((error) => {
      // handle error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        if(error.response.status == "409"){
          return error.response.data;
        }


      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }

  static async listSubscriptionForFitbitId(
    fitbitId,
    collectionPath,
    accessToken
  ) {
    console.log(
      `${this.name}.listSubscriptionForFitbitId: fitbitId: ${fitbitId}, collectionPath: ${collectionPath}, accessToken: ${accessToken}`
    );
    // /1/user/[user-id]/[collection-path]/apiSubscriptions.json

    return axios({
      method: "post",
      url: `https://api.fitbit.com/1/user/${fitbitId}/${collectionPath}/apiSubscriptions.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      /*
      params: {
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      }
      */
      //data: {}
    }).then((response) => {
      let responseData = response.data;

      return responseData;
    });
  }

  static async getActvitySummaryForProfile(profileData, accessToken, dateTime) {
    console.log(
      `${this.name}.getActvitySummaryForProfile: profileData: ${JSON.stringify(
        profileData
      )}, accessToken: ${accessToken}`
    );
    return axios({
      method: "get",
      url: `https://api.fitbit.com/1/user/${
        profileData.user.encodedId
      }/activities/date/${dateTime.toISODate()}.json`,
      // `headers` are custom headers to be sent
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
      //data: {}
    }).then((response) => {
      let activitySummaryData = response.data;

      return activitySummaryData;
    });
  }
}