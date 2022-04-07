import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import MyUtility from "../lib/MyUtility.mjs";
//import { DateTime } from "luxon";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const deleteTasks = await prisma.task.deleteMany({})

let taskList = await prisma.task.createMany({
  data: MyUtility.taskList
});

console.log(`Insert taskList.length: ${taskList.length}`);
