import * as dotenv from "dotenv";
import prisma from "../lib/prisma.mjs";
import { DateTime } from "luxon";

/*
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const databaseName = "walk_to_joy";
*/



import TaskExecutor from "../lib/TaskExecutor.mjs";
import MyUtility from "../lib/MyUtility.mjs";


let users = await prisma.users.findMany({
    select: {
        username: true,
        phone: true,
        preferredName: true,
        gif: true,
        salience: true,
        modification: true,
        weekdayWakeup: true,
        weekdayBed: true,
        weekendWakeup: true,
        weekendBed: true,
        timezone: true
    },
});


function replacer(key, value) {
    if (typeof value === "Date") {
      return value.toString();
    }
    return value;
}

let userList = JSON.parse(JSON.stringify(users, replacer));


// test randomization
function testRandomization(choiceList, total){
    let resultDict = {};

    for(let i = 0; i < total; i++){
        let result = TaskExecutor.randomizeSelection(choiceList);

        if(resultDict[result.value] == undefined){
            resultDict[result.value] = 1;
        }
        else{
            resultDict[result.value] = resultDict[result.value] + 1;
        }
    }

    // convert to percentage
    Object.keys(resultDict).forEach((key) => {
        resultDict[key] = resultDict[key]/total;
    });

    return resultDict;
}

let total = 1000000;
let choiceList = [
    {value: "messageLabelA", chance: 0.5},
    {value: "messageLabelB", chance: 0.5}
];
//console.log(`testRandomization(${total}) for ${JSON.stringify(choiceList)}: ${JSON.stringify(testRandomization(choiceList, total))}`);


TaskExecutor.executeTask(MyUtility.aTaskSpec, userList);