import DatabaseUtility from "../../lib/DatabaseUtility.mjs";
import prisma from "../../lib/prisma.mjs";
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

    switch (function_name) {
        case "create_subscriptions":
            const {fitbitId} = req.body;
            const firstUser = await prisma.users.findFirst({
                where: { fitbitId: fitbitId },
            });
            let resultPromise = await DatabaseUtility.createSubscriptionsForUser(firstUser);
            res.status(200).json({ result: resultPromise });
            return;
        default:
            return;
    }
}
