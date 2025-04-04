import Twilio from "twilio";
process.loadEnvFile();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = Twilio(accountSid, authToken);

export default class TwilioHelper {
  constructor() {}

  static sendMessage(
    phone,
    bodyMessage,
    mediaUrlList = ["https://demo.twilio.com/owl.png"]
  ) {
    let msgConfigObj = {
      messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
      //from: "+18045755737",
      body: bodyMessage,
      mediaUrl: mediaUrlList,
      to: `${phone}`, //"+17342773256",
    };

    return client.messages
      .create(msgConfigObj)
      .then((message) => {
        return message;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }
}
