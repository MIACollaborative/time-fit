import prisma from "../../lib/prisma"

export default async function handler(req, res) {
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
        case "update_info":
                
                const { username,  ...rest } = req.body;
                console.log(`rest: ${JSON.stringify(rest)}`);
                const aUser = await prisma.users.update({
                    where: { username: username },
                    data: rest,
                });
    
                res.status(200).json({ result: "success" });
                return;
        default:
            return;
    }
}
