import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { DateTime } from "luxon";

// post schema
/*
model Post {
    id        String  @id @default(dbgenerated()) @map("_id") @db.ObjectId
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    published Boolean  @default(false)
    title     String
    content String
    author    users?    @relation(fields: [authorId], references: [id])
    authorId  String @db.ObjectId
}
*/

const adminUsernameList = ["test1", "test2", "test3", "test4"];


export default async function handler(req, res) {
    const session = await getSession({ req })
    if (!session) {
        // Not Signed in
        res.status(401).json({});
        res.end();
        return
    }

    // Signed in
    // console.log("Session", JSON.stringify(session, null, 2))

    let userName = session.user.name;

    const { function_name } = req.query;

    switch (function_name) {
        case "get":
            let itemList = [];

            if (adminUsernameList.includes(userName)) {
                let  queryObj = {
                    orderBy: [
                      {
                        updatedAt: "desc",
                      },
                    ]
                  };
                itemList = await prisma.message.findMany(queryObj);

            }
            

            res.status(200).json({ result: itemList });
            return;
        default:
            return;
    }
}
