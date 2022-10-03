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

        // should probably rename it, 
        // "and" means, every day passes the threshold
        // "or" means, at least one day passes the threshold
        // "not any" means, none passes the threshold

        idRelationship: "and", 


        period:{
            start:{
                reference: referenceDateStr, // "today"
                offset: {type: "minus", value: {days: 15}}
                
            },
            end:{			
                reference: referenceDateStr, // "today"
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