import * as dotenv from "dotenv";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.mjs";
import TaskExecutor from "../lib/TaskExecutor.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
//import { DateTime } from "luxon";


if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}


// insert the fake subscription first
//const deleteSubs = await prisma.fitbit_subscription.deleteMany({});

let fakeSubscription = [
    {
        collectionType: "activities",
        ownerId: "xyz",
        ownerType: "user",
        subscriberId: "1",
        subscriptionId: "1"
    },
    
    {
        collectionType: "userRevokedAccess",
        ownerId: "xyz",
        ownerType: "user",
        subscriberId: "1",
        subscriptionId: "2"
    }
    
];

const fakeSubscriptions = await prisma.fitbit_subscription.createMany({
    data: fakeSubscription
});

//let username = "test1";

// this gives you the number of taskLog that associated with this particular user.

let userList = await DatabaseUtility.getUsersWithLessThanCertainSubscritions(2);


console.log(`usersWithIncopmleteSubscription: ${JSON.stringify(userList)}`);
