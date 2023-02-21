import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

/*
let recordList = await prisma.fitbit_update.findMany({
    take: 3,
    orderBy: [
        {
            createdAt: 'desc',
        }
    ]
});
*/


let recordList = [
    {
        "id": "63f4d6c36ff9520d57514dfa",
        "collectionType": "activities",
        "date": "2023-02-24",
        "ownerId": "4SW9W9",
        "ownerType": "user",
        "subscriptionId": "1",
        "status": "processed",
        "ip": "34.67.42.65",
        "validity": null,
        "createdAt": "2023-02-21T14:35:47.152Z",
        "updatedAt": "2023-02-21T14:36:01.318Z"
    },
];

for(let i = 0; i < recordList.length; i++){
    let fitbitUpdate = recordList[i];
    console.log(`[${fitbitUpdate.ownerId}][${fitbitUpdate.date}] ----------------------------------------`);
    let result = await DatabaseUtility.shouldFitbitUpdateBeProcessed(fitbitUpdate);
    console.log(`${fitbitUpdate.ownerId} - ${fitbitUpdate.date}: shouldUpdate? ${result}`);
}