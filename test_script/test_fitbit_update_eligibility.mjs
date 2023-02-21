import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import GeneralUtility from "../lib/GeneralUtility.mjs";



if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let recordList = await prisma.fitbit_update.findMany({
    /*
    where:{
        ownerId: fitbitId,
        ownerType: ownerType,
        collectionType: collectionType,
        createdAt: {
            gte: startDateTime.toISO(),
            lte: endDateTime.toISO()
        }
    },
    */
    take: 3,
    //orderBy: orderList
});

for(let i = 0; i < recordList.length; i++){
    console.log(`[${fitbitUpdate.ownerId}][${fitbitUpdate.date}] ----------------------------------------`);
    let result = await DatabaseUtility.shouldFitbitUpdateBeProcessed(fitbitUpdate);
    console.log(`${fitbitUpdate.ownerId} - ${fitbitUpdate.date}: shouldUpdate? ${result}`);
}