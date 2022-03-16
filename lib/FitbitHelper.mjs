import axios from "axios";
import pkg from 'luxon';
const {DataTime} = pkg;


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