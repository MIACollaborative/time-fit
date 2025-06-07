import Twilio from 'twilio';

import * as dotenv from "dotenv";


//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  //console.log(`after config() - TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID}, TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN}`);
}

//console.log(`TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID}, TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN}`);


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


//const client = require("twilio")(accountSid, authToken);
const client = Twilio(accountSid, authToken);

export default class TwilioHelper {
  //client;

  constructor() {

  }


  static sendMessage(phone, bodyMessage, mediaUrlList= ["https://demo.twilio.com/owl.png"]){
    let msgConfigObj = {
      messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
      //from: "+18045755737",
      body: bodyMessage, //"Hello there!",
      mediaUrl: mediaUrlList, // mediaUrlList.length > 0? mediaUrlList: [], // ["https://demo.twilio.com/owl.png"],
      to: `${phone}`, //"+17342773256",
      /*
     body: 'Hello there!',
     from: '+15555555555',
     mediaUrl: ['https://demo.twilio.com/owl.png'],
     to: '+12316851234'
     */
    };

    /*
    if(mediaUrl.length > 0){
      msgConfigObj["mediaUrl"] = mediaUrlList;
    }
    */




    return client.messages
    .create(msgConfigObj)
    .then((message) => {
      return message;
    })
    .catch((error) => {
      console.error(error); // Can be thrown by any 
      return error;

      //return error;
    });
    /*
    .done(() =>{
    });
    */
  }
}