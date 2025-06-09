import UserInfoHelper from "@time-fit/helper/UserInfoHelper";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";


import DatabaseUtility from "../../lib/DatabaseUtility.mjs";


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    // Not Signed in
    res.status(401).json({});
    res.end();
    return;
  }

  const { function_name } = req.query;

  console.log(`function: ${function_name}`);

  switch (function_name) {
    case "create_subscriptions":
      const { fitbitId } = req.body;

      const firstUser = await UserInfoHelper.getUserInfoByPropertyValue(
        "fitbitId",
        fitbitId
      );

      let resultPromise = await DatabaseUtility.createSubscriptionsForUser(
        firstUser
      );
      res.status(200).json({ result: resultPromise });
      return;
    default:
      return;
  }
}
