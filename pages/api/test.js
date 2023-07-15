import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { DateTime } from "luxon";

const adminUsernameList = ["test1", "test2", "test3", "test4"];

export const config = {
    api: {
        responseLimit: "100mb",
    },
}

export default async function handler(req, res) {
    console.log(`task-log.handler`);

    const session = await getSession({ req })
    if (!session) {
        // Not Signed in
        console.log(`task-log.handler: not sign in`);
        res.status(401).json({});
        res.end();
        return
    }

    // Signed in
    // console.log("Session", JSON.stringify(session, null, 2))

    let userName = session.user.name;

    const { function_name } = req.query;
    //const { author_id } = req.body;
    const { limit = 0, startDate, endDate } = req.body;


    let timeConstraint = {
        gte: DateTime.fromISO(startDate).toISO(),
        lte: DateTime.fromISO(endDate).toISO()
    };
    let taskLogList = [];
    let queryObj = undefined;

    switch (function_name) {
        case "query":
            queryObj = {
                where: {
                    createdAt: timeConstraint
                },
                orderBy: [
                    {
                        updatedAt: "desc",
                    },
                ],
            };

            if (limit > 0) {
                queryObj["take"] = limit;
            }

            if (adminUsernameList.includes(userName)) {
                console.log(`test.handler: is admin`);
                taskLogList = await prisma.taskLog.findMany(queryObj);
            }
            else {
                console.log(`test.handler: is not admin`);
            }

            let responseLength = taskLogList.length;
            console.log(`test.handler: taskLogList.length: ${responseLength}`);
            //res.status(200).json({ result: taskLogList });
            res.status(200).json({ result: responseLength });
            return;
        case "get":
                queryObj = {
                    where: {
                        createdAt: timeConstraint
                    },
                    orderBy: [
                        {
                            updatedAt: "desc",
                        },
                    ],
                };
    
                if (limit > 0) {
                    queryObj["take"] = limit;
                }
    
                if (adminUsernameList.includes(userName)) {
                    console.log(`test.handler: is admin`);
                    taskLogList = await prisma.taskLog.findMany(queryObj);
                }
                else {
                    console.log(`test.handler: is not admin`);
                }
    
                console.log(`test.handler: taskLogList.length: ${taskLogList.length}`);
                //res.status(200).json({ result: taskLogList });
                res.status(200).json({ result: taskLogList });
                return;
        default:
            return;
    }
}

