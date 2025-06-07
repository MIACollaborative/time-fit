import axios from "axios";
import pkg from 'luxon';
const {DataTime} = pkg;
import FitbitHelper from "./FitbitHelper.mjs";

import prisma from "./prisma";


export default class MyHelper {
  //client;

  constructor() {
    //this.client = new MongoClient(uri);
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
}