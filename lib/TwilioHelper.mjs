import Twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


//const client = require("twilio")(accountSid, authToken);
const client = Twilio(accountSid, authToken);

export default class TwilioHelper {
  //client;

  constructor() {

  }


  static sendMessage(phone, bodyMessage, mediaUrl= ["https://demo.twilio.com/owl.png"]){
    client.messages
    .create({
      messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
      //from: "+18045755737",
      body: bodyMessage, //"Hello there!",
      mediaUrl: mediaUrl, // ["https://demo.twilio.com/owl.png"],
      to: `${phone}`, //"+17342773256",
      /*
     body: 'Hello there!',
     from: '+15555555555',
     mediaUrl: ['https://demo.twilio.com/owl.png'],
     to: '+12316851234'
     */
    })
    .then((message) => console.log(message.sid))
    .done();
  }
}