import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import TwilioHelper from "../lib/TwilioHelper.mjs";

console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID}, TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN}`);
