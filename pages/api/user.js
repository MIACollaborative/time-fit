import prisma from "../../lib/prisma"
import { getSession } from "next-auth/react";

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


    const {username} = req.body;

    switch (function_name) {
        case "update_time_preference":
            const {weekdayWakeup, weekdayBed, weekendWakeup, weekendBed, timezone } = req.body;
            const updateUser = await prisma.users.update({
                where: { username: username },
                data: {
                    weekdayWakeup,
                    weekdayBed,
                    weekendWakeup,
                    weekendBed,
                    timezone
                },
            });

            res.status(200).json({ result: "success" });
            return;
        case "update_group_assignment":
                const {gif, salience, modification } = req.body;
                console.log(`typeof gif: ${typeof gif}`);
                console.log(`typeof salience: ${typeof salience}`);
                console.log(`typeof modification: ${typeof modification}`);
                await prisma.users.update({
                    where: { username: username },
                    data: 
                    {
                        gif,
                        salience,
                        modification
                    }
                });
    
                res.status(200).json({ result: "success" });
                return;
        case "update_info":

                const { username,  ...rest } = req.body;
                console.log(`rest: ${JSON.stringify(rest)}`);
                const aUser = await prisma.users.update({
                    where: { username: username },
                    data: rest,
                });
    
                res.status(200).json({ result: "success" });
                return;
        case "get_info":

            const user = await prisma.users.findFirst({
                where: { username: userName },
            });

            const userInfo = JSON.parse(JSON.stringify(user, replacer));

            res.status(200).json({ result: userInfo });
            return;
        default:
            return;
    }
}
