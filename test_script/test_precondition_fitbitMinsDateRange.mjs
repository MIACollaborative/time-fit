import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import {DateTime} from "luxon";

let userInfo = await prisma.users.findFirst({
    where: {
        username: "test2"
    }
});


let referenceDateStr = "today";


let sampleCondition = {
	
	type: "hasHeartRateIntradayMinutesAboveThresholdForPersonByDateRange",

	criteria: {
        wearingLowerBoundMinutes: 30,
        idRelationship: "and",
        period:{
            start:{
                reference: referenceDateStr,
                // Need to make sure that the minute and seconds do not get in the way of calculatioon
                offset: {type: "minus", value: {days: 15}}
                
            },
            end:{			
                reference: referenceDateStr,
                // Need to make sure that the minute and seconds do not get in the way of calculatioon
                offset: {type: "minus", value: {days: 0}},
                
            }
        }
	}

};

// checkOneConditionForUser(condition, userInfo, dateTime)


let testDate = DateTime.fromFormat("10/03/2022, 1:07:04 PM", "F");

//let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());

let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, testDate.toUTC());


console.log(`checkOneConditionForUser: ${result}`);