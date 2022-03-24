import prisma from "../../lib/prisma"

export default async function handler(req, res) {
    const { function_name } = req.query;
    

    console.log(`function: ${function_name}`);

    switch (function_name) {
        case "update_time_preference":
            const {username,  weekdayWakeup, weekdayBed, weekendWakeup, weekendBed } = req.body;
            const updateUser = await prisma.users.update({
                where: { username: username },
                data: {
                    weekdayWakeup,
                    weekdayBed,
                    weekendWakeup,
                    weekendBed
                },
            });

            res.status(200).json({ result: "success" });
            return;
        default:
            return;
    }
}
