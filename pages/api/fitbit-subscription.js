// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import GeneralUtility from "../../lib/GeneralUtility.mjs";

import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log(`fitbit-subscription: ${JSON.stringify(req.body)}`);

    let ip = GeneralUtility.getIPFromRequest(req);
    console.log(`fitbit-subscription.handler ip: ${ip}`);

    let notificationList = req.body.map((item) => {
        return {...item, ip, status: "notification"};
    });

    const aNotification = await prisma.fitbit_subscription.create({
            data: notificationList
    });

    res.status(204).end();
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