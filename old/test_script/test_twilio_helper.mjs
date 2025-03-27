import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import TwilioHelper from "../lib/TwilioHelper.mjs";

/*
console.log(
  `TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID}, TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN}`
);
*/

/*
TwilioHelper.sendMessage("7342773256", "test", []).then((tResult) => {
  console.log(`TwilioHelper.sendMessage: ${JSON.stringify(tResult)}`);
});
*/

let tResult = await TwilioHelper.sendMessage("7342773256", "test", []);
console.log(`TwilioHelper.sendMessage: ${JSON.stringify(tResult)}`);
