import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import {DateTime} from "luxon";

let userInfo = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});


let sampleCondition = {
	
	type: "timeInPeriod",
	
	criteria: {
		
        start:{
			
            reference: "activateAtDate",
            // Need to make sure that the minute and seconds do not get in the way of calculatioon
            offset: {type: "plus", value: {days: 8}}
            
        },
        end:{
			
            reference: "activateAtDate",
            // Need to make sure that the minute and seconds do not get in the way of calculatioon
            offset: {type: "plus", value: {days: 10}},
            inclusive: false
            
        }
	
	}

};

// checkOneConditionForUser(condition, userInfo, dateTime)


let result = await TaskExecutor.checkOneConditionForUser(sampleCondition, userInfo, DateTime.utc());


console.log(`checkOneConditionForUser: ${result}`);