import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import {DateTime} from "luxon";

let userInfo = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});


let referenceDateStr = "joinAtDate";


let sampleCondition = {
	
	type: "timeInPeriod",
	
	criteria: {
		
        start:{
			
            reference: referenceDateStr,
            // Need to make sure that the minute and seconds do not get in the way of calculatioon
            offset: {type: "plus", value: {days: 0}}
            
        },
        end:{
			
            reference: referenceDateStr,
            // Need to make sure that the minute and seconds do not get in the way of calculatioon
            offset: {type: "plus", value: {days: 0}},
            inclusive: false
            
        }
	
	}

};

// checkOneConditionForUser(condition, userInfo, dateTime)


let testDate = DateTime.fromFormat("5/10/2022, 1:07:04 PM", "F");

//let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());

let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, testDate.toUTC());


console.log(`checkOneConditionForUser: ${result}`);