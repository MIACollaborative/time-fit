import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import MyUtility from "../lib/MyUtility.mjs";
//import { DateTime } from "luxon";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}


function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
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

async function getUserMessageCountDict(username){
    const results = await prisma.taskLog.groupBy({
        by: ['messageLabel'],
        where: {
            username: {
                equals: username,
            },
        },
        _count: {
            messageLabel: true,
        },
    });
    
    
    let resultList = JSON.parse(JSON.stringify(results, replacer));

    //console.log(`resultList: ${JSON.stringify(resultList, null, 2)}`);


    let resultDict = {};

    resultList.forEach((result) => {

        /*()
        {
            "_count": {
              "messageLabel": 1
            },
            "messageLabel": "nongif-m_23"
          }
        */

        if (result["messageLabel"] != null){
            resultDict[result["messageLabel"]] = result["_count"]["messageLabel"];
        }
    });

    return resultDict;
}




console.log(`resultDict for ${username}: ${JSON.stringify(await getUserMessageCountDict(username), null, 2)}`);
