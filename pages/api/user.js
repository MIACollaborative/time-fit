import prisma from "../../lib/prisma"

export default async function handler(req, res) {
    const { function_name } = req.query;
    const { type, content } = req.body;

    console.log(`function: ${function_name}`);

    switch (function_name) {
        case "update_user":
            const updateUser = await prisma.users.update({
                where: { username: userInfo.username },
                data: {
                    weekdayWakeup: accessToken,
                    weekdayBed: dayBed,
                    weekendWakeup: endWake,
                    weekendBed: endBed
                },
            });

            res.status(200).json({ result: "success" });
            return;
        default:
            return;
    }
}
