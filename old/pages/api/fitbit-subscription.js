import GeneralUtility from "../../lib/GeneralUtility.mjs";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log(`fitbit-subscription: ${JSON.stringify(req.body)}`);

    const { verify } = req.query;

    console.log(`fitbit-subscription verify: ${verify}`);

    let ip = GeneralUtility.getIPFromRequest(req);
    console.log(`fitbit-subscription.handler ip: ${ip}`);

    let validity = verify == process.env.FITBIT_SUBSCRIPTION_VERIFICATION_CODE;

    console.log(`fitbit-subscription validity: ${validity}`);

    console.log(`fitbit-subscription typeof req.body: ${typeof req.body}`);

    if (verify != undefined ) {
        // should be treated as a verify request
        if(validity){
            res.status(204).end();
        }
        else {
            // now a valid verification request
            res.status(404).end();
        }
    }
    else{
        // is not a verify request
        // verify == undefined && 

        if (req.body.length > 0) {
            let notificationList = req.body.map((item) => {
                return { ...item, ip, status: "notification"};
            });
            const aNotification = await prisma.fitbit_update.createMany({
                data: notificationList
            });
            console.log(`fitbit-subscription: insert notifications: ${JSON.stringify(notificationList)}`);
            res.status(204).end();
        }
    }
}