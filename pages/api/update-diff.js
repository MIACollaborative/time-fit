import prisma from "../../lib/prisma"
import { getSession } from "next-auth/react";
import DatabaseUtility from "../../lib/DatabaseUtility.mjs";

const adminUsernameList = ["test1", "test2", "test3", "test4"];


export default async function handler(req, res) {
    const session = await getSession({ req })
    if (!session) {
        // Not Signed in
        res.status(401).json({});
        res.end();
        return
    }


    const { function_name } = req.query;




    console.log(`function: ${function_name}`);


    let username = session.user.name;
    //const { username } = req.body;

    switch (function_name) {
        case "get":
            let itemList = [];

            let queryObj = {
                orderBy: [
                    {
                        updatedAt: "desc",
                    },
                ]
            };
            if (adminUsernameList.includes(username)) {
                itemList = await prisma.update_diff.findMany(queryObj);
            }
            res.status(200).json({ result: itemList });
            return;
        default:
            return;
    }
}
