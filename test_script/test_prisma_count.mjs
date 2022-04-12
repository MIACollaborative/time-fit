import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import MyUtility from "../lib/MyUtility.mjs";
//import { DateTime } from "luxon";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}




let username = "test1";

// this gives you the number of taskLog that associated with this particular user.
/*
const usersWithCount = await prisma.users.findMany({
    where: {
        username: {
            equals: username,
        },
    },
    include: {
      _count: {
        select: { taskLogList: true },
      },
    },
})
*/






console.log(`resultDict for ${username}: ${JSON.stringify(await MyUtility.getUserMessageCountDict(username), null, 2)}`);
