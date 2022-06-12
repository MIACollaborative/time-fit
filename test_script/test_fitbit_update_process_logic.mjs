import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import { DateTime } from "luxon";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

let recentUpdateList = DatabaseUtility.getFitbitUpdateByStatusWithLimit("notification", 50);


console.log(`recentUpdateList: ${JSON.stringify(recentUpdateList, null, 2)}`);
console.log(`recentUpdateList.length: ${recentUpdateList.length}`);

let filteredUpdateList = GeneralUtility.removeFitbitUpdateDuplicate(recentUpdateList);

console.log(`filteredUpdateList: ${JSON.stringify(filteredUpdateList, null, 2)}`);
console.log(`filteredUpdateList.length: ${filteredUpdateList.length}`);

// now, for each update, retrieve accordingly

let resultList = filteredUpdateList.map((fitbitUpdate) => {
    // false: avoid storing the data
    return DatabaseUtility.queryAndStoreFitbitDataByFitbitUpdate(fitbitUpdate, false);
});
console.log(`resultList: ${JSON.stringify(resultList, null, 2)}`);
console.log(`resultList.length: ${resultList.length}`);

resultStatus = "success";
resultErrorMessage = "";

for (let i = 0; i < resultList.length; i++) {
    let curResult = resultList[i];
    // one failed is failed
    if (curResult.value == "failed") {
        resultStatus = "failed";
        resultErrorMessage += `${curResult.data} - `;
    }
}

let resultBody = resultList.map((result) => {
    return result.body;
});


let successResultList = resultList.filter((result) => {
    return result.status == "success";
});

console.log(`successResultList: ${JSON.stringify(successResultList, null, 2)}`);
console.log(`successResultList.length: ${successResultList.length}`);

/*
for (let i = 0; i < successResultList.length; i++) {
    let compositeId = successResultList[i].compositeId;
    // now, mark records with this composite id to have status: "processed"
    const updatedFitbitUpdateList = await prisma.fitbit_update.updateMany({
        where: {
            compositeId: compositeId
        },
        data: {
            status: 'processed',
        }
    })
}

record.executionResult = {
    type: "fitbit",
    value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: resultBody
    }
};


console.log(`executeActionForUser record.executionResult: ${JSON.stringify(record.executionResult)}`);
*/