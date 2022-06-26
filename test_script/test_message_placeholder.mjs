import DatabaseUtility from "../lib/DatabaseUtility.mjs";
import prisma from "../lib/prisma.mjs";


let userInfo = await prisma.users.findFirst({
    where: {
        username: "test1"
    }
});

let sampleMesssageTemplate = `Remember to enhance your walking experience on your upcoming walks. Here is what you said you would try this week: "[response|SV_cACIS909SMXMUp8|last]". `;


let resultMsg = await DatabaseUtility.replacePlaceholderFromMessage(sampleMesssageTemplate, userInfo, "");


console.log(`resultMsg: ${JSON.stringify(resultMsg, null, 2)}`);