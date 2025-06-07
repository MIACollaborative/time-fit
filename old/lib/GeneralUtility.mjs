import { DateTime, Interval } from "luxon";
import voca from "voca";
import { getDiff } from "json-difference";

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}
export default class GeneralUtility {
  //client;

  static FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY = "activity-summary";
  static FITBIT_INTRADAY_DATA_TYPE_HEART = "activity-heart";
  static FITBIT_INTRADAY_DATA_TYPE_STEP = "activity-step";

  static unitList = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
  ];

  static systemUser = {
    username: "system-user",
    //password String
    //hash String @unique

    // additional user information
    preferredName: "System User",
    phone: "",
    timezone: "America/Detroit",

    // for study management
    phase: "intervention",

    // for group assignment
    /*
        gif: true,
        salience: true,
        modification: true,
        */

    // for Fitbit
    /*
        fitbitId String?
        fitbitDisplayName String?
        fitbitFullName String?
        accessToken String?
        refreshToken String?
        */

    // for user preference
    /*
        weekdayWakeup DateTime?
        weekdayBed DateTime?
        weekendWakeup DateTime?
        weekendBed DateTime?
        */
  };

  static fitbitUpdateSampleList = [
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2022-05-28",
      ownerId: "4SW9W9",
      ownerType: "user",
      subscriptionId: "1",
    },
    {
      collectionType: "activities",
      date: "2021-12-14",
      ownerId: "9BK4CS",
      ownerType: "user",
      subscriptionId: "9BK4CS-activities-3",
    },
    {
      collectionType: "activities",
      date: "2022-05-01",
      ownerId: "9BK4CS",
      ownerType: "user",
      subscriptionId: "9BK4CS-activities-3",
    },
    {
      collectionType: "activities",
      date: "2021-12-21",
      ownerId: "9BK4CS",
      ownerType: "user",
      subscriptionId: "9BK4CS-activities-3",
    },
  ];

  static responseSampleList = [
    {
      participantId: "test2",
      responseId: "R_wYqbwGbXs6tZzhL",
      dateTime: "2022-05-24T08:41:00Z",
      surveyId: "SV_cACIS909SMXMUp8",
      surveyLink: "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8",
      surveyParamsString: "study_code=test2",
      content: "huh?",
    },
    {
      participantId: "test1",
      responseId: "R_XMRDYnIbnI8GpOh",
      dateTime: "2022-06-22T01:52:00Z",
      surveyId: "SV_6QJa9e00C4gywQu",
      surveyLink: "https://umich.qualtrics.com/jfe/form/SV_6QJa9e00C4gywQu",
      surveyParamsString: "study_code=test1",
      content: "Stay the same",
    },
    {
      participantId: "test1",
      responseId: "R_2uX8jjqLRFDQ4m8",
      dateTime: "2022-06-22T01:54:00Z",
      surveyId: "SV_cACIS909SMXMUp8",
      surveyLink: "https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8",
      surveyParamsString: "study_code=test1",
      content: "listen to music",
    },
    {
      participantId: "test1",
      responseId: "R_12JXBJDX1pinp5W",
      dateTime: "2022-06-22T01:57:00Z",
      surveyId: "SV_bBoOhje0dSNbZgq",
      surveyLink: "https://umich.qualtrics.com/jfe/form/SV_bBoOhje0dSNbZgq",
      surveyParamsString: "study_code=test1",
      content: "bring a friend",
    },
    {
      participantId: "test1",
      responseId: "R_12JXBJDX1pitest",
      dateTime: "2022-06-22T01:57:00Z",
      surveyId: "SV_81aWO5sJPDhGZNA",
      surveyLink: "https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA",
      surveyParamsString: "study_code=test1",
      content: "test",
    },
  ];

  constructor() {}

  static usTimeZoneOffetInfoList = [
    { name: "America/New_York", offset: -240, offsetLabel: "GMT -4" },

    /*
        { name: 'America/Detroit', offset: -240, offsetLabel: 'GMT -4' },
        {
            name: 'America/Kentucky/Louisville',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Kentucky/Monticello',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Indianapolis',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Vincennes',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Winamac',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Marengo',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Petersburg',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        {
            name: 'America/Indiana/Vevay',
            offset: -240,
            offsetLabel: 'GMT -4'
        },
        */
    { name: "America/Chicago", offset: -300, offsetLabel: "GMT -5" },
    /*
        {
            name: 'America/Indiana/Tell_City',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        { name: 'America/Indiana/Knox', offset: -300, offsetLabel: 'GMT -5' },
        { name: 'America/Menominee', offset: -300, offsetLabel: 'GMT -5' },
        {
            name: 'America/North_Dakota/Center',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        {
            name: 'America/North_Dakota/New_Salem',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        {
            name: 'America/North_Dakota/Beulah',
            offset: -300,
            offsetLabel: 'GMT -5'
        },
        */
    { name: "America/Denver", offset: -360, offsetLabel: "GMT -6" },
    /*{ name: 'America/Boise', offset: -360, offsetLabel: 'GMT -6' },*/
    /* { name: 'America/Phoenix', offset: -420, offsetLabel: 'GMT -7' }, */
    { name: "America/Los_Angeles", offset: -420, offsetLabel: "GMT -7" },
    { name: "America/Anchorage", offset: -480, offsetLabel: "GMT -8" },
    /*
        { name: 'America/Juneau', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Sitka', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Metlakatla', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Yakutat', offset: -480, offsetLabel: 'GMT -8' },
        { name: 'America/Nome', offset: -480, offsetLabel: 'GMT -8' },
        */
    { name: "America/Adak", offset: -540, offsetLabel: "GMT -9" },
    { name: "Pacific/Honolulu", offset: -600, offsetLabel: "GMT -10" },
    { name: "Brazil/Rio de Janeiro", offset: -180, offsetLabel: "GMT -3" },
    { name: "Canada/St. Johns", offset: -150, offsetLabel: "GMT -2.5" },
    { name: "United Kingdom/London", offset: -0, offsetLabel: "GMT -0" },
    { name: "France/Paris", offset: +60, offsetLabel: "GMT +1" },
    { name: "South Africa/Cape Town", offset: +120, offsetLabel: "GMT +2" },
    { name: "Kenya/Nairobi", offset: +180, offsetLabel: "GMT +3" },
    { name: "Iran/Tehran", offset: +210, offsetLabel: "GMT +3.5" },
    { name: "United Arab Emirates/Dubai", offset: +240, offsetLabel: "GMT +4" },
    { name: "Afghanistan/Kabul", offset: +270, offsetLabel: "GMT +4.5" },
    { name: "Pakistan/Islamabad", offset: +300, offsetLabel: "GMT +5" },
    { name: "India/Mumbai", offset: +330, offsetLabel: "GMT +5.5" },
    { name: "Thailand/Bangkok", offset: +420, offsetLabel: "GMT +7" },
    { name: "China/Beijing", offset: +480, offsetLabel: "GMT +8" },
    { name: "South Korea/Seoul", offset: +540, offsetLabel: "GMT +9" },
    { name: "Australia/Brisbane", offset: +600, offsetLabel: "GMT +10" },
    {
      name: "South Australia/Adelaide",
      offset: +630,
      offsetLabel: "GMT +10.5",
    },
    { name: "Australia/Sydney", offset: +660, offsetLabel: "GMT +11" },
    { name: "New Zealand/Auckland", offset: +780, offsetLabel: "GMT +13" },
  ];

  static getTSVStringFromObjectList(objectList) {
    let csvString = "";

    if (objectList.length == 0) {
      return csvString;
    }
    // prepare the csv string
    let headerList = Object.keys(objectList[0]);
    let headerString = headerList.join("\t");
    csvString += headerString + "\n";

    // now the content
    objectList.forEach((info) => {
      let contentList = headerList.map((columnName) => {
        //return info[columnName];
        return JSON.stringify(info[columnName]);
      });

      let contentString = contentList.join("\t");
      csvString += contentString + "\n";
    });

    return csvString;
  }

  static getCSVStringFromObjectList(objectList) {
    let csvString = "";

    if (objectList.length == 0) {
      return csvString;
    }
    // prepare the csv string
    let headerList = Object.keys(objectList[0]);
    let headerString = headerList.join(",");
    csvString += headerString + "\n";

    // now the content
    objectList.forEach((info) => {
      let contentList = headerList.map((columnName) => {
        //return info[columnName];
        return `"${JSON.stringify(info[columnName])}"`;
      });

      let contentString = contentList.join(",");
      csvString += contentString + "\n";
    });

    return csvString;
  }

  static getObjectAsJSONDiff(oldObj, newObj) {
    let oldDocument = JSON.parse(JSON.stringify(oldObj));
    let newDocument = JSON.parse(JSON.stringify(newObj));
    return getDiff(oldDocument, newDocument, true);
  }

  static getLocalTime(datetime, timezone) {
    return datetime.setZone(timezone);
  }

  static syncToFirstDateTimeBeforeUnit(datetime1, datetime2, unitString) {
    let unitIndex = GeneralUtility.unitList.indexOf(unitString);

    /*
        let datetime1 = DateTime.fromJSDate(date1);
        let datetime2 = DateTime.fromJSDate(date2);
        */

    let newDateTime2 = DateTime.fromObject(datetime2.toObject());

    for (let i = 0; i < this.unitList.length; i++) {
      let curUnit = this.unitList[i];

      if (i < unitIndex) {
        let unitsString = `${unitString}s`;

        let option = { [curUnit]: datetime1.get(curUnit) };
        console.log(`curUnit set : ${JSON.stringify(option)}`);
        newDateTime2 = newDateTime2.set(option);
      }
    }

    //console.log(`${this.name}.zeroAfterUnit before return: ${newDateTime}`);

    return [datetime1, newDateTime2];
  }

  static matchSqureBracketPlaceholder(message) {
    var reString = `\\[[^\\[\\]]*\\]`;

    var re = new RegExp(reString, "g");

    const found = message.matchAll(re);

    let matchList = [...found].flat();

    console.log(JSON.stringify(matchList));

    return matchList;
  }

  static getLastWeekAsInterval(nowDateTime = DateTime.now()) {
    //  Interval#start and Interval#end
    let start = nowDateTime.minus({ days: 7 }).startOf("week");
    let end = nowDateTime.minus({ days: 7 }).endOf("week");

    return Interval.fromDateTimes(start, end);
  }

  static filterFitbitWalkActivityListByDuration(
    walkList,
    minDurationInSeconds = 10 * 60
  ) {
    return walkList.filter((record) => {
      return record.duration / 1000 >= minDurationInSeconds;
    });
  }

  static getWeekdayOrWeekend(datetime) {
    console.log(`getWeekdayOrWeekend: ${datetime.weekday}`);
    if (datetime.weekday < 6) {
      return "weekday";
    } else {
      return "weekend";
    }
  }

  static setToReferenceDateAndSeconds(datetime, referenceDateTime) {
    return datetime.set({
      year: referenceDateTime.year,
      month: referenceDateTime.month,
      day: referenceDateTime.day,
      second: referenceDateTime.second,
      millisecond: referenceDateTime.millisecond,
    });
  }

  static convertToUTCWithUTCDate(datetimeString, referenceUTC) {
    console.log(
      `convertToUTCWithUTCDate DateTime.fromISO(datetimeString).toUTC(): ${DateTime.fromISO(
        datetimeString
      ).toUTC()}`
    );
    return DateTime.fromISO(datetimeString)
      .toUTC()
      .set({
        year: referenceUTC.year,
        month: referenceUTC.month,
        day: referenceUTC.day,
        second: referenceUTC.second,
        millisecond: referenceUTC.millisecond,
      });
  }

  static diffDateTime(datetimeA, datetimeB, unit) {
    return datetimeB.diff(datetimeA, unit);
  }

  static operateDateTime(dateTime, offset, operator) {
    let result = undefined;
    switch (operator) {
      case "plus":
        result = dateTime.plus(offset);
        break;
      case "minus":
        result = dateTime.minus(offset);
        break;
      default:
        break;
    }

    return result;
  }

  static generateStartOrEndDateTimeByReference(
    targetDateTime,
    userInfo,
    timeDefinition,
    startOrEnd = "start"
  ) {
    let resultDateTime;

    let startEndOfUnit = "no";
    let startEndUnit = "day";

    if (timeDefinition != undefined) {
      switch (timeDefinition.reference) {
        case "now":
          break;
        case "today":
          startEndOfUnit = startOrEnd;
          break;
        case "activateAtDate":
          startEndOfUnit = startOrEnd;
          break;
        case "joinAtDate":
          startEndOfUnit = startOrEnd;
          break;
        case "completeAtDate":
          startEndOfUnit = startOrEnd;
          break;
        default:
          break;
      }

      resultDateTime = GeneralUtility.generateDateTimeByReference(
        targetDateTime,
        userInfo,
        timeDefinition.reference,
        startEndOfUnit,
        startEndUnit
      );
      resultDateTime = GeneralUtility.operateDateTime(
        resultDateTime,
        timeDefinition.offset.value,
        timeDefinition.offset.type
      );
    } else {
      switch (startOrEnd) {
        case "start":
          resultDateTime = DateTime.utc(2000);
          break;
        case "end":
          resultDateTime = targetDateTime; //.toUTC();
          break;
        default:
          break;
      }
    }

    console.log(
      `${this.name} generateStartOrEndDateTimeByReference: ${resultDateTime}`
    );
    return resultDateTime;
  }

  static generateDateTimeByReference(
    targetDateTime,
    userInfo,
    reference,
    startEndOfUnit = "no",
    startEndUnit = "day"
  ) {
    console.log(
      `${this.name} generateDateTimeByReference: ${targetDateTime},${userInfo.username},${reference}, ${startEndOfUnit},${startEndUnit}`
    );
    let resultDateTime = undefined;

    console.log(
      `${this.name} generateDateTimeByReference: userInfo.timezone: ${userInfo.timezone}`
    );
    switch (reference) {
      case "now":
        resultDateTime = targetDateTime; //.toUTC();// DateTime.utc();
        break;
      case "today":
        // I need to use datetime
        // Step 1: convert to a participant's local time
        resultDateTime = targetDateTime; //.startOf("day").toUTC();
        break;
      case "activateAtDate":
        resultDateTime = GeneralUtility.getLocalTime(
          DateTime.fromISO(userInfo.activateAt),
          userInfo.timezone
        ); //.startOf("day");
        break;
      case "joinAtDate":
        console.log(
          `${this.name} generateDateTimeByReference: userInfo.joinAt: ${
            userInfo.joinAt
          }, type: ${typeof userInfo.joinAt}`
        );
        resultDateTime = GeneralUtility.getLocalTime(
          DateTime.fromISO(userInfo.joinAt),
          userInfo.timezone
        );
        break;
      case "completeAtDate":
        resultDateTime = GeneralUtility.getLocalTime(
          DateTime.fromISO(userInfo.completeAt),
          userInfo.timezone
        );
        break;
      default:
        break;
    }

    console.log(
      `${this.name} generateDateTimeByReference: before startEndOfUnit: ${resultDateTime}`
    );

    switch (startEndOfUnit) {
      case "start":
        resultDateTime = resultDateTime.startOf(startEndUnit);
        break;
      case "end":
        // I need to use datetime
        // Step 1: convert to a participant's local time
        resultDateTime = resultDateTime.endOf(startEndUnit);
        break;
      default:
        break;
    }

    console.log(`${this.name} generateDateTimeByReference: ${resultDateTime}`);
    return resultDateTime;
  }

  static extractSurveyLinkFromAction(actionInfo) {
    let surveyURL = "";

    if (
      actionInfo["surveyType"] != undefined &&
      actionInfo["surveyType"].length > 0
    ) {
      if (actionInfo["surveyType"] == "surveyLink") {
        surveyURL = actionInfo["surveyLink"];
      }
      /*
            else if( actionInfo["surveyType"] == "surveyLabel"){
                let surveyLabel = actionInfo["surveyLabel"];
                let survey
                surveyURL = actionInfo["surveyLink"];
            }
            */
    }

    return surveyURL;
  }

  static async getUserMessageFromGroupWithLowestFrequency(username, groupName) {
    //let resultList = [];

    let frequencyDict = await GeneralUtility.getUserMessageFromGroupCountDict(
      username,
      groupName
    );

    //console.log(`getUserMessageFromGroupWithLowestFrequency.frequencyDict: ${JSON.stringify(frequencyDict)}`);

    let frequencyList = Object.keys(frequencyDict).map((messageLabel) => {
      return {
        label: messageLabel,
        info: frequencyDict[messageLabel].info,
        frequency: frequencyDict[messageLabel].count,
      };
    });

    //console.log(`frequencyList: ${JSON.stringify(frequencyList)}`);

    frequencyList.sort((a, b) => {
      return a.frequency - b.frequency;
    });

    let lowestFrequency = frequencyList[0].frequency;

    let lowFrequencyList = frequencyList.filter((item) => {
      return item.frequency == lowestFrequency;
    });

    return lowFrequencyList;
  }

  static generateCompositeIDForFitbitUpdate(aList = []) {
    return aList.join("_");
  }

  static removeFitbitUpdateDuplicate(updateList, includeStatus = false) {
    console.log(
      `${this.name} removeFitbitUpdateDuplicate: updateList.length: ${updateList.length}`
    );
    let compositeIDMap = {};

    let filteredList = updateList.filter((item) => {
      let idComponentList = [item.ownerId, item.collectionType, item.date];

      if (includeStatus) {
        idComponentList.push(item.status);
      }
      let compositeId =
        GeneralUtility.generateCompositeIDForFitbitUpdate(idComponentList);

      //console.log(`compositeId: ${compositeId}`);
      if (compositeIDMap[compositeId] == undefined) {
        compositeIDMap[compositeId] = true;
        //console.log(`First time: compositeId: ${compositeId}`);
        return true;
      } else {
        // run into the same signature before
        //console.log(`Not the first time: compositeId: ${compositeId}`)
        return false;
      }
    });
    //console.log(`${this.name} removeFitbitUpdateDuplicate: filteredList: ${filteredList}`);

    return filteredList;
  }

  static isRequestFromLocalhost(req) {
    let ip = GeneralUtility.getIPFromRequest(req);

    let ipSplit = ip.split(":");

    // check the last one
    return ipSplit[ipSplit.length - 1] == "127.0.0.1";
  }

  static getIPFromRequest(req) {
    let forwarded = req.headers["x-forwarded-for"];
    console.log(
      `getIPFromRequest: req.headers["x-forwarded-for"]: ${forwarded}`
    );
    console.log(
      `getIPFromRequest:  req.connection.remoteAddress: ${req.connection.remoteAddress}`
    );
    let ip = forwarded
      ? forwarded.split(/, /)[0]
      : req.connection.remoteAddress;

    return ip;
  }

  static extractUserInfoCache(userInfo) {
    const { id, password, hash, accessToken, refreshToken, ...rest } = userInfo;

    return { ...rest };

    /*
        model users {
            id  String  @id @default(auto()) @map("_id") @db.ObjectId
            username String @unique
            password String
            hash String @unique
          
            // additional user information
            preferredName String?
            phone String?
            timezone String?
          
            // for group assignment
            gif Boolean? @default(false)
            salience Boolean? @default(false)
            modification Boolean? @default(false)
          
            // reference other collections
            taskLogList  taskLog[]
          
          
            // for Fitbit
            fitbitId String?
            fitbitDisplayName String?
            fitbitFullName String?
            accessToken String?
            refreshToken String?
          
            // for user preference
            weekdayWakeup DateTime?
            weekdayBed DateTime?
            weekendWakeup DateTime?
            weekendBed DateTime?
          
          
            // for time
            createdAt DateTime? @default(now())
            updatedAt DateTime? @updatedAt
          }
        */
  }

  static convertRandomizationResultToString(rResult) {
    let result = "";

    switch (rResult.type) {
      case "noAction":
        result = `noAction`;
        break;
      default:
        if (rResult.theChoice != undefined) {
          result = `chance: ${rResult.theChoice.chance}, random: ${rResult.randomNumber}`;
        } else {
          result = "";
        }
        break;
    }

    return result;
  }

  static extractOutcomeToString(theChoice) {
    let result = "";
    let excludeNameList = ["type"];

    if (theChoice != undefined) {
      result = `[${theChoice.chance}]${theChoice.action.type} -`;
      Object.keys(theChoice.action).forEach((propertyName) => {
        if (!excludeNameList.includes(propertyName)) {
          if (theChoice.action[propertyName] == undefined) {
          } else if (typeof theChoice.action[propertyName] != "string") {
            result =
              result + ` ${propertyName}:${theChoice.action[propertyName]}`;
          } else if (
            typeof theChoice.action[propertyName] == "string" &&
            theChoice.action[propertyName].length > 0
          ) {
            result =
              result + ` ${propertyName}:${theChoice.action[propertyName]}`;
          }
        }
      });
    }

    return result;
  }

  static convertExecutionResultToString(eResult) {
    let result = "";

    // {"type":"twilio","value":{"body":"Hello Pei-Yao, it's your bed time. Here is a random survey for you. https://umich.qualtrics.com/jfe/form/SV_cACIS909SMXMUp8?study_code=test1","numSegments":"0","direction":"outbound-api","from":null,"to":"+17342773256","dateUpdated":"2022-04-14T02:47:11.000Z","price":null,"errorMessage":null,"uri":"/2010-04-01/Accounts/process.env.TWILIO_ACCOUNT_SID/Messages/SM6ca91344dfa04ef4891715a3615a7002.json","accountSid":"process.env.TWILIO_ACCOUNT_SID","numMedia":"0","status":"accepted","messagingServiceSid":"MG05ede0540932555ae0e1b9b88876a30f","sid":"SM6ca91344dfa04ef4891715a3615a7002","dateSent":null,"dateCreated":"2022-04-14T02:47:11.000Z","errorCode":null,"priceUnit":null,"apiVersion":"2010-04-01","subresourceUris":{"media":"/2010-04-01/Accounts/process.env.TWILIO_ACCOUNT_SID/Messages/SM6ca91344dfa04ef4891715a3615a7002/Media.json"}}}

    switch (eResult.type) {
      case "noAction":
        result = `noAction`;
        break;
      default:
        if (eResult.type != undefined && eResult.value != undefined) {
          result = `type: ${eResult.type}, status: ${eResult.value.status}, errorMessage: ${eResult.value.errorMessage}`;
        }
        break;
    }

    return result;
  }

  static extractUserKeyAttributesToString(userInfo) {
    if (userInfo == null) {
      return "";
    }

    let result = `gif: ${userInfo.gif}, salience: ${userInfo.salience}, modification: ${userInfo.modification}, weekdayWakeup: ${userInfo.weekdayWakeup}, weekendWakeup: ${userInfo.weekendWakeup}, timesonze: ${userInfo.timezone}`;
    return result;
  }

  static doesFitbitInfoExist(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitId != null &&
      userInfo.fitbitId.length > 0 &&
      userInfo.accessToken != null &&
      userInfo.accessToken.length > 0 &&
      userInfo.refreshToken != null &&
      userInfo.refreshToken.length > 0
    );
  }

  static async sendTwilioMessage(phone, messageBody, mediaUrlList = []) {
    console.log(`GeneralUtility.sendTwilioMessage: ${phone} - ${messageBody}`);

    const result = await fetch("/api/twilio?function_name=send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        messageBody,
        mediaUrlList: mediaUrlList.length > 0 ? mediaUrlList : null,
      }),
    }).then((r) => {
      return r.json();
    });

    console.log(`GeneralUtility.sendTwilioMessage: result: ${result}`);

    return result;
  }

  static isPreferredNameSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.preferredName != undefined && userInfo.preferredName.length > 0
    );
  }

  static isWakeBedTimeSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.weekdayWakeup != undefined &&
      userInfo.weekdayBed != undefined &&
      userInfo.weekendWakeup != undefined &&
      userInfo.weekendBed != undefined
    );
  }

  static isFitbitReminderTurnOff(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitReminderTurnOff != undefined &&
      userInfo.fitbitReminderTurnOff
    );
  }

  static isWalkToJoySaveToContacts(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.saveWalkToJoyToContacts != undefined &&
      userInfo.saveWalkToJoyToContacts
    );
  }

  static isWalkSetTo10(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.autoWalkTo10 != undefined && userInfo.autoWalkTo10;
  }

  static isTimezoneSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.timezone != undefined;
  }

  static isUserInfoPropertyValueMatched(userInfo, propertyValueObject) {
    let result = true;

    Object.keys(propertyValueObject).forEach((propertyName) => {
      if (userInfo[propertyName] != propertyValueObject[propertyName]) {
        result = false;
      }
    });

    return result;
  }
  static extractUserInfoPropertyValueMatched(userInfo, propertyValueObject) {
    let resultInfo = {};

    Object.keys(propertyValueObject).forEach((propertyName) => {
      resultInfo[propertyName] = userInfo[propertyName];
    });

    return resultInfo;
  }

  static reduceBooleanArray(bArray, operator) {
    let result = true;

    let initialValue = bArray.length > 0 ? bArray[0] : false;

    switch (operator) {
      case "and":
        result = bArray.reduce(
          (previousValue, currentValue) => previousValue && currentValue,
          initialValue
        );
        break;
      case "or":
        result = bArray.reduce(
          (previousValue, currentValue) => previousValue || currentValue,
          initialValue
        );
        break;
      case "not any":
        result = !bArray.reduce(
          (previousValue, currentValue) => previousValue || currentValue,
          initialValue
        );
        break;
      default:
        break;
    }

    return result;
  }
}
