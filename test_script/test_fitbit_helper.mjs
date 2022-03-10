import FitbitHelper from "../utilities/FitbitHelper.mjs";

//import MongoDBHelper from "../utilities/MongoDBHelper.mjs"
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

//const mHelper = new MongoDBHelper();

//const databaseName = "walk_to_joy";

//mHelper.testConnection();


// MongoDBHelper.insertDataIntoTable("walk_to_joy", "logs", [{message: "test3"}], true);


FitbitHelper.getProfile(`${process.env.FITBIT_ACCESS_TOKEN}`)
.then((responseData) => {
    console.log(`FitbitHelper.getProfile: ${JSON.stringify(responseData)}`);
});
