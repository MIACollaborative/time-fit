import axios from "axios";
import pkg from 'luxon';
const {DataTime} = pkg;
//import prisma from "./prisma";

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

  static async introspectToken(accessToken, inspectToken) {
    console.log(`${this.name}.inspectToken: inspectToken: ${inspectToken}`);

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
          'Authorization': `Bearer ${accessToken}`,
          // Content-Type: application/x-www-form-urlencoded
          'Accept': `application/json`,
          'Content-Type': `application/x-www-form-urlencoded`
        },
        /*
        params: {
          'token': inspectToken
        },
        */
       // Note, the {'token': inspectToken} approach won't work orz
        data: `token=${inspectToken}` //{'Token': inspectToken}
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