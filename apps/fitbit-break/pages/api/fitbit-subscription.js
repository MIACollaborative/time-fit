// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import GeneralUtility from "../../lib/GeneralUtility.mjs";

import prisma from "../../lib/prisma";

export default async function handler(req, res) {

    const { verify } = req.query;
    let ip = GeneralUtility.getIPFromRequest(req);

    let validity = verify == process.env.FITBIT_SUBSCRIPTION_VERIFICATION_CODE;

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
            res.status(204).end();
        }
    }
}


// Example
/*
[
    {
        "collectionType": "foods",
        "date": "2010-03-01",
        "ownerId": "USER_1",
        "ownerType": "user",
        "subscriptionId": "1234"
    }, {
        "collectionType": "foods",
        "date": "2010-03-02",
        "ownerId": "USER_1",
        "ownerType": "user",
        "subscriptionId": "1234"
    }, {
        "collectionType": "activities",
        "date": "2010-03-01",
        "ownerId": "X1Y2Z3",
        "ownerType": "user",
        "subscriptionId": "2345"
    }
]
*/