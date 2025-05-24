import Twilio from "twilio";
//process.loadEnvFile();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = Twilio(accountSid, authToken);

export default class TwilioHelper {
  constructor() {}

  static sendMessage(
    phone,
    bodyMessage,
    mediaUrlList = ["https://demo.twilio.com/owl.png"]
  ) {
    let msgConfigObj = {
      messagingServiceSid: messagingServiceSid,
      body: bodyMessage,
      mediaUrl: mediaUrlList,
      to: `${phone}`
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
