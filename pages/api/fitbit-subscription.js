// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log(`fitbit-subscription: ${JSON.stringify(req.body)}`);

    const aNotification = await prisma.fitbit_subscription.create({
            data: {
                ...req.body,
                status: "notification"
            },
        });

    res.status(204).end();
}
  