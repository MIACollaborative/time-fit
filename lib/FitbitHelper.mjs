import axios from "axios";
import pkg from 'luxon';
const {DataTime} = pkg;

import prisma from "./prisma";

const basicToken = "***REMOVED***";
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
        method: 'post',
        url: 'https://api.fitbit.com/oauth2/token',
        // `headers` are custom headers to be sent
        headers: {
          // now sure where this comes from?
          'Authorization': `Basic ${basicToken}`,
          'Content-Type':'application/x-www-form-urlencoded'
        },
        params: {
          'clientId': '23829X',
          'grant_type': 'authorization_code',
          'redirect_uri': 'https://walktojoy.net/fitbit-signin',
          'code': authCode
        }
      })
      .then((response) => {
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
        method: 'get',
        url: `https://api.fitbit.com/1/user/-/profile.json`,
        // `headers` are custom headers to be sent
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        //data: {}
      })
      .then((response) => {

        let profileData = response.data;

        return profileData;
      });
  }

  static async refreshAccessTokenIfNecessary(hash, accessToken, refreshToken) {
    console.log(`${this.name}.refreshAccessTokenIfNecessary: accessToken: ${accessToken}`);

    const user = await prisma.users.findFirst({
      where: { hash: hash},
    });

    return FitbitHelper.introspectToken(accessToken)
      .then((responseData) => {
        console.log(`Access token active?: ${responseData.active}`);
        if(responseData.active == false){
          
          return FitbitHelper.refreshToken(refreshToken)
              .then((refreshData) => {
                  console.log(
                      `FitbitHelper.refreshToken: ${JSON.stringify(
                        refreshData
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
      
                  let newAccessToken = refreshData.access_token;
      
                  // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
                  let newRefreshToken = refreshData.refresh_token;
      
                  // To Do: ideally, store both
                  updateToken(hash, newAccessToken, newRefreshToken);
      
                  return { value: "success", data: responseData };
      
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
        }
      })
      .catch((error) => {return error;})
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
        method: 'post',
        url: `https://api.fitbit.com/oauth2/token`,
        // `headers` are custom headers to be sent
        headers: {
          'Authorization': `Basic ${basicToken}`,
          'Accept': `application/json`
        },
        params: {
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken
        }
        //data: {}
      })
      .then((response) => {
        let responseData = response.data;

        return responseData;
      });
  }

  static async introspectToken(inspectToken) {
    console.log(`${this.name}.refreshToken: refreshToken: ${refreshToken}`);

    /*
    curl -X POST "https://api.fitbit.com/1.1/oauth2/introspect" \
-H "accept: application/json" \
-H "authorization: Bearer <access_token> \" 
-d "token=<The OAuth 2.0 token to retrieve the state>"
    */
    
    return axios({
        method: 'post',
        url: `https://api.fitbit.com/1.1/oauth2/introspect`,
        // `headers` are custom headers to be sent
        headers: {
          'Authorization': `Basic ${basicToken}`,
          'Accept': `application/json`
        },
        params: {
          'token': inspectToken
        }
        //data: {}
      })
      .then((response) => {
        let responseData = response.data;
        console.log(`FitbitHelper.introspectToken: ${JSON.stringify(responseData)}`)


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

  static async getActvitySummaryForFitbitId(encodedId, accessToken, dateTime) {
    console.log(`${this.name}.getActvitySummaryForFitbitId: fitbitId: ${encodedId}, accessToken: ${accessToken}`);
    return axios({
        method: 'get',
        url: `https://api.fitbit.com/1/user/${encodedId}/activities/date/${dateTime.toISODate()}.json`,
        // `headers` are custom headers to be sent
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': `application/json`
        },
        //data: {}
      })
      .then((response) => {
        let activitySummaryData = response.data;

        return activitySummaryData;
      });
  }

  static async getActvitySummaryForProfile(profileData, accessToken, dateTime) {
    console.log(`${this.name}.getActvitySummaryForProfile: profileData: ${JSON.stringify(profileData)}, accessToken: ${accessToken}`);
    return axios({
        method: 'get',
        url: `https://api.fitbit.com/1/user/${profileData.user.encodedId}/activities/date/${dateTime.toISODate()}.json`,
        // `headers` are custom headers to be sent
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': `application/json`
        },
        //data: {}
      })
      .then((response) => {
        let activitySummaryData = response.data;

        return activitySummaryData;
      });
  }
}