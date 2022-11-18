import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";


let userInfo = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});

let sampleMesssageTemplate = `You wear Fitbit over 8 hours for [fitbit_wearing_days_since_join|480|3] days.`;


let resultMsg = await DatabaseUtility.replacePlaceholderFromMessage(sampleMesssageTemplate, userInfo, "");


console.log(`resultMsg: ${JSON.stringify(resultMsg, null, 2)}`);