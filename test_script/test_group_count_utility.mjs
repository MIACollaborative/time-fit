import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import MyUtility from "../lib/MyUtility.mjs";
//import { DateTime } from "luxon";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


let groupMessageCountDict = await MyUtility.getUserMessageFromGroupCountDict("test1", "nongif-m");

console.log(`groupMessageCountDict: ${JSON.stringify(groupMessageCountDict)}`);

let messaageLowerFrequencyList = await MyUtility.getUserMessageLabelFromGroupWithLowestFrequency("test1", "nongif-m");

console.log(`groupMessageLowest: ${JSON.stringify(messaageLowerFrequencyList)}`);