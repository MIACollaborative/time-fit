import FitbitHelper from "../lib/FitbitHelper.mjs";
import { inspect } from 'util';
//import MongoDBHelper from "../utilities/MongoDBHelper.mjs"
//import * as dotenv from "dotenv";

/*
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
*/

//const mHelper = new MongoDBHelper();

//const databaseName = "walk_to_joy";

//mHelper.testConnection();


// MongoDBHelper.insertDataIntoTable("walk_to_joy", "logs", [{message: "test3"}], true);

/*
FitbitHelper.getProfile(`${process.env.FITBIT_ACCESS_TOKEN}`)
.then((responseData) => {
    console.log(`FitbitHelper.getProfile: responseData`);

    // console.log(`FitbitHelper.getProfile: responseData ${JSON.stringify(responseData)}`);
});
*/

/*
FitbitHelper.getAuthorizationInformation("627b2644ca77031de5cccd447c8ed04ba7af7907")
.then((responseData) => {

    console.log(
        `FitbitHelper.getAuthorizationInformation: responseData: ${responseData}`
      );
});
*/

let testToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzgyOVgiLCJzdWIiOiI0U1c5VzkiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJwcm8iLCJleHAiOjE2NDc0ODY3OTYsImlhdCI6MTY0NzQ1Nzk5Nn0.Mn9t4rnUfSWavNLowTgyfi4Ncu91oxFjXM0uhs09lwQ";
FitbitHelper.introspectToken(testToken)
.then((responseData) => {
  console.log(
      `FitbitHelper.introspectToken: responseData: ${responseData}`
    );
})
.catch((error) => {
  let resultObj = {};
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(`Data: ${JSON.stringify(error.response.data)}`);
    console.log(`Status: ${error.response.status}`);
    console.log(`StatusText: ${error.response.statusText}`);
    console.log(`Headers: ${JSON.stringify(error.response.headers)}`);

    console.log(`Error response`);
    resultObj = eval(`(${inspect(error.response.data)})`);
    // which means, authentication falil
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);

    console.log(`Error request`);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);

    console.log("Error else");
  }
  //res.status(error.response.status).json({ response: inspect(error.response.data) });

  
  return {value: "failed", data: resultObj};
});