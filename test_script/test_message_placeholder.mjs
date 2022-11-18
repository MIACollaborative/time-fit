import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

let aUser = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});

let userInfo = JSON.parse(JSON.stringify(aUser, replacer));

let sampleMesssageTemplate = `You wear Fitbit over 8 hours for [fitbit_wearing_days_since_join|480|3]/3 days sincing joining the study.`;


let resultMsg = await DatabaseUtility.replacePlaceholderFromMessage(sampleMesssageTemplate, userInfo, "");


console.log(`resultMsg: ${JSON.stringify(resultMsg, null, 2)}`);