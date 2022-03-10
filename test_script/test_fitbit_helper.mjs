import FitbitHelper from "../lib/FitbitHelper.mjs";

//import MongoDBHelper from "../utilities/MongoDBHelper.mjs"
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

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


FitbitHelper.getAuthorizationInformation("627b2644ca77031de5cccd447c8ed04ba7af7907")
.then((responseData) => {
    /*
    console.log(
      `FitbitHelper.getAuthorizationInformation: ${JSON.stringify(
        responseData
      )}`
    );
    */

    console.log(
        `FitbitHelper.getAuthorizationInformation: responseData: ${responseData}`
      );
});
