import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import FitbitHelper from "../lib/FitbitHelper.mjs";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const users = await prisma.users.findMany();

// try only one
let userInfo = users[0];

let introspectTokenResult = await FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken)
.then((responseData) => {
    console.log(`Access token active?: ${responseData.active}`);
    return;
    
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

// 401	The request requires user authentication.

console.log(`introspectTokenResult: ${JSON.stringify(introspectTokenResult, null, 2)}`);

/*
let introspectTokenResultList = users.map((userInfo) => {
    return FitbitHelper.introspectToken(userInfo.accessToken, userInfo.accessToken);
});

console.log(`introspectTokenResultList: ${JSON.stringify(introspectTokenResultList, null, 2)}`);

*/
// test token introspect first


// test toekn refresh second

// test ensure token valid third


