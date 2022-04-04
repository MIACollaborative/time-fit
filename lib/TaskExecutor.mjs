

let aTaskSpec = {
    checkPoint: {
        type: "absolute", // absolute vs. relative
        reference: {
            weekday:[1,2,3,4,5,6,7],
            type: "fixed", // fixed or preference
            value: "8:00 PM" // (if preference) (wakeupTime, bedTime, createdAt)
        },
        offset: {
            type: "plus",
            value: {hours: 0}
        }
    },
    group: {
        type: "all", // all or group
        membership: {
            gif: [true, false],
            salience: [true, false],
            modification: [true, false]
        }
    },
    randomization:{
        // Note: could potentially separate this out to be random + action
        enabled: true, // true or false
        outcome: [
            {
                value: true,
                chance: 0.5,
                action: {
                    type: "surveyId", // surveyId, or surveyGroup
                    surveyId: "XYZ", //surveyId, only matter if the tyep is surveyId
                    surveyGroup: "gif", // surveyGroup, only matter if the type is surveyGroup
                    avoidHistory: true, // if we want to minimize the chance of sending the same message to the same user in a short window
                }
            },
            {
                value: false,
                chance: 0.5,
            }
        ]
    },
    preCondition:{
        // stil in draft
        type: "surveyFilled",
        requirement: {
            type: "surveyId",
            surveyId: "XYZ",
            //surveyGroup: "gif" // advanced feature I guesss
            timingType: "absolute", // absolute vs. relative
            periood: { // this part needs a lot more thinking
                start: {
                    reference: {
                        weekday:[1,2,3,4,5,6,7],
                        type: "preference", // fixed or preference
                        value: "8:00 AM" // (if preference) (wakeupTime, bedTime, createdAt)
                    },
                    offset: {
                        type: "minus",
                        value: {days: 7}
                    }

                },
                end: {
                    reference: {
                        weekday:[1,2,3,4,5,6,7],
                        type: "fixed", // fixed or preference
                        value: "8:00 PM" // (if preference) (wakeupTime, bedTime, createdAt)
                    },
                    offset: {
                        type: "plus",
                        value: {hours: 0}
                    }
                }
            }
        }
    }
};

export default class TaskExecutor {


  constructor() {}



  static executeTaskForUser(userInfo, taskSpec){


  }


  static sendMessage(phone, bodyMessage){
    client.messages
    .create({
      messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
      //from: "+18045755737",
      body: bodyMessage, //"Hello there!",
      mediaUrl: ["https://demo.twilio.com/owl.png"],
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