// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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

    if (validity && req.body.length > 0) {
        let notificationList = req.body.map((item) => {
            return { ...item, ip, status: "notification", validity };
        });
        const aNotification = await prisma.fitbit_update.create({
            data: notificationList
        });
    }

    if (validity) {
        res.status(204).end();
    }
    else {
        res.status(404).end();
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