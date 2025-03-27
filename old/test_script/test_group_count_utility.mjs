import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
//import { DateTime } from "luxon";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


//let groupMessageCountDict = await MyUtility.getUserMessageFromGroupCountDict("test1", "nongif-m");

//console.log(`groupMessageCountDict: ${JSON.stringify(groupMessageCountDict)}`);

//let messaageLowerFrequencyList = await MyUtility.getUserMessageFromGroupWithLowestFrequency("test1", "nongif-m");

//console.log(`groupMessageLowest: ${JSON.stringify(messaageLowerFrequencyList)}`);

/*
let processedList = messaageLowerFrequencyList.map((item) => {
    const {label, info, frequency} = item;
    return {label, frequency};
});

console.log(`processedList: ${JSON.stringify(processedList)}`);
*/

let messageInfo = await DatabaseUtility.findMessageByGroup("test", true, "test1");

console.log(`messageInfo: ${JSON.stringify(messageInfo)}`);

