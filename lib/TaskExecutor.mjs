import MyUtility from "../lib/MyUtility.mjs";

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


  constructor() {
      this.participantList = [];
  }


  static setParticipantsList(pList){
    this.participantList = pList;
  }

  static executeTask(taskSpec){
    // Step 1: use grouop to filter out the participants to be considered for this task
    let userList = this.participantList;

    userList = userList.filter((userInfo) => {
        if(taskSpec.group == "all"){
            return true;
        }
        else if(taskSpec.group == "group"){
            let groupMatched = false;
            Object.keys(taskSpec.membership).forEach((groupName) => {
                if(taskSpec.membership.includes(userInfo[groupName])){
                    groupMatched = true;
                }
            });
            return groupMatched;
        }
    });

    // ok, so now we will only consider thses users in the userList

    // Step 2: Now, checking the local time against the "checkPoint" specified in the taskSpec
    userList = userList.filter((userInfo) => {
        return isCheckPointForUser(taskSpec.checkPoint, userInfo);
    });

    // Step 3: Now, do the randomization and log the outcome regardless


  }

  static isCheckPointForUser(checkPoint, userInfo){
    // Will return true if the time is right for this user. If not, return false;
    let result = false;

    // checkPoint example
    /*
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
    */

    // step 1: identify what time attribute should be used for comparison

    // step 1.1: use timezone to get local time
    let now = DateTime.now();
    let nowUTC = now.toUTC();

    let localTimeForUser = MyUtility.getLocalTime(now, userInfo.timezone);
    let localWeekIndex = MyUtility.getWeekdayOrWeekend(localTimeForUser);
    
    //DateTime.fromISO(userInfo.weekdayWakeup).toUTC().set({year: nowUTC.year, month: nowUTC.month, day: nowUTC.day, second: nowUTC.second, millisecond: nowUTC.millisecond});

    // Step 1.2: check whether the weekday even pass (if it is the right day)
    // [Note] I will likely have to deal with people go to bed at 12:00 AM later

    if(!checkPoint.reference.includes(localWeekIndex)){
        // this is not the right week index
        return false;
    }

    // ok. so now at least the weekday (or weekend) is correct (or included)

    let targetTime = undefined;

    let diffDateTime = undefined;

    if(checkPoint.reference.type == "fixed"){
        // value: "8:00 PM"
        let hourMinuteString = checkPoint.reference.value;

        // ToDo: need to copy the datetime and then ooverwrite with the value here
        targetTime = DateTime.fromFormat(hourMinuteString, "t");

        // need to check if the time is on the right date locally
        console.log(`targetTime: ${targetTime}`);


        // To Do: need to determine whether it is a match

        diffDateTime = MyUtility.diffDateTime(targetTime, nowUTC, "minutes");

    }
    else if (checkPoint.reference.type == "preference"){
        // (if preference) (wakeupTime, bedTime, createdAt)
        // get local time

        let referenceTimePropertyName = checkPoint.reference.value;

        let userReferenceTime = userInfo[referenceTimePropertyName];

        let userReferenceUTCTime = MyUtility.convertToUTCWithUTCDate(userReferenceTime, nowUTC);

        // To Do: need to determine whether it is a match

        diffDateTime = MyUtility.diffDateTime(userReferenceUTCTime, nowUTC, "minutes");


        // let localTimeForUser = MyUtility.getLocalTime(now, userInfo.timezone);
        // let weekdayIndex = MyUtility.getWeekdayOrWeekend(localTimeForUser);

    }

    if( diffDateTime.toObject().minutesTime != 0){
        return false;
    }

    // ok, by now, we shoudl have verify whether at least the checkPoint match




    return result;
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