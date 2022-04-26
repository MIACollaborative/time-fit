import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";
//import { DateTime } from "luxon";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const deleteTasks = await prisma.task.deleteMany({})

let taskList = await prisma.task.createMany({
  data: GeneralUtility.taskList
});

console.log(`Insert taskList.length: ${taskList.length}`);
