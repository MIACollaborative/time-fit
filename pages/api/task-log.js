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

    console.log(`task-log.handler: userName: ${userName}`);

    const { function_name } = req.query;
    //const { author_id } = req.body;
    const { limit = 0, startDate, endDate } = req.body;

    console.log(`task-log.handler: startDate: ${startDate}`);
    console.log(`task-log.handler: endDate: ${endDate}`);
    console.log(`task-log.handler: limit: ${limit}`);

    let timeConstraint = {
        gte: DateTime.fromISO(startDate).toISO(),
        lte: DateTime.fromISO(endDate).toISO()
    };
    let taskLogList = [];
    let queryObj = undefined;

    switch (function_name) {
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
                console.log(`task-log.handler: is admin`);
                taskLogList = await prisma.taskLog.findMany(queryObj);
            }
            else {
                console.log(`task-log.handler: is not admin`);
            }
            console.log(`task-log.handler: taskLogList.length: ${taskLogList.length}`);
            res.status(200).json({ result: taskLogList });
            return;
        case "get_investigator":


            queryObj = {
                where: {
                    taskLabel: { contains: "investigator" },
                    createdAt: timeConstraint
                },
                orderBy: [
                    {
                        updatedAt: "desc",
                    },
                ],
                //take: queryLimit
            };

            if (limit > 0) {
                queryObj["take"] = limit;
            }


            if (adminUsernameList.includes(userName)) {
                console.log(`task-log.handler: is admin`);
                taskLogList = await prisma.taskLog.findMany(queryObj);
            }
            else {
                console.log(`task-log.handler: is not admin`);
            }
            console.log(`task-log.handler: taskLogList.length: ${taskLogList.length}`);
            res.status(200).json({ result: taskLogList });
            return;
        default:
            return;
    }
}


/*
case "create":
    const {
        title,
        content,
        tagList,
        published,
        reaction_to_id,
        reaction_source_text,
    } = req.body;
    console.log(
        `post.create: ${JSON.stringify(
            { title, content, tagList, published, reaction_to_id, reaction_source_text },
            null,
            2
        )}`
    );

    const newPost = await prisma.post.create({
        data: {
            content: content,
            title: title,
            content: content,
            tagList: tagList,
            authorId: author_id,
            reactionToId: reaction_to_id == "" ? null : reaction_to_id,
            reactionToSourceText: reaction_source_text,
            published: String(published).toLowerCase() == "true",
        },
    });
    console.log(`post.create about to return: ${author_id}`);
    res.status(200).json({ result: newPost });
    return;
case "update":
    const { post_id, update_value } = req.body;

    const updatedPost = await prisma.post.update({
        where: { id: post_id },
        data: update_value,
    });
    res.status(200).json({ result: updatedPost });
    return;
case "get_connection_posts":
    const numQuestions = 3;

    // Query for most recent <numQuestions> # questions
    let questionObject = {
        where: {
            published: true,
            OR: [
                {
                    authorId: {
                        equals: author_id,
                    },
                },
                {
                    author: {
                        is: {
                            relationshipSink: {
                                some: {
                                    personSourceId:
                                    {
                                        equals: author_id,
                                    },
                                },
                            },
                        },
                    },
                },
            ],
            tagList: {
                has: "question",
            },
        },
        include: {
            author: true,
        },
        orderBy: [
            {
                updatedAt: "desc",
            },
        ],
        take: numQuestions,
    };

    // Query all connection posts (including possibly the same as above)
    let qObject = {
        where: {
            published: true,
            OR: [
                {
                    authorId: {
                        equals: author_id,
                    },
                },
                {
                    author: {
                        is: {
                            relationshipSink: {
                                some: {
                                    personSourceId:
                                    {
                                        equals: author_id,
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        },
        include: {
            author: true,
        },
        orderBy: [
            {
                updatedAt: "desc",
            },
        ],
        take: limit > 0 ? limit : undefined,
    };

    const questionPosts =
        await prisma.post.findMany(questionObject);
    const connectionPosts =
        await prisma.post.findMany(qObject);

    // Select one of the questions to randomly display at the top
    const randIndex = Math.floor(
        Math.random() * questionPosts.length
    );
    const selectedQuestion =
        questionPosts[randIndex];

    // Remove the randomly selected question to avoid duplicates
    const filteredPosts = selectedQuestion
        ? connectionPosts.filter(
            (post) =>
                post.id !== selectedQuestion.id
        )
        : connectionPosts;

    const finalPosts = selectedQuestion
        ? [selectedQuestion].concat(filteredPosts)
        : filteredPosts;
    res.status(200).json({ result: finalPosts });
    return;
case "get_nonconnection_posts":
    let qObjectN = {
        where: {
            published: true,
            NOT: {
                authorId: {
                    equals: author_id,
                },
            },
            author: {
                isNot: {
                    relationshipSink: {
                        some: {
                            personSourceId: {
                                equals: author_id,
                            },
                        },
                    },
                },
            },
        },
        include: {
            author: true,
        },
        orderBy: [
            {
                updatedAt: "desc",
            },
        ],
        take: limit > 0 ? limit : null,
    };

    const nonConnectionPosts =
        await prisma.post.findMany(qObjectN);
    res.status(200).json({
        result: nonConnectionPosts,
    });
    return;
case "get_posts_with_tag":
    const { tag } = req.body;
    const taggedPosts = await prisma.post.findMany({
        where: {
            published: true,
            tagList: {
                has: tag,
            },
        },
        include: {
            author: true,
        },
        orderBy: [
            {
                updatedAt: "desc",
            },
        ],
    });
    res.status(200).json({ result: taggedPosts });
    return;
*/