import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { DateTime } from "luxon";
import FitbitDataHelper from "@time-fit/data-source/fitbit/helper/FitbitDataHelper.js";

const adminUsernameList = ["test1", "test2", "test3", "test4"];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({});
    res.end();
    return;
  }

  const { function_name } = req.query;
  const { limit = 0, startDate, endDate } = req.body;

  const timeConstraint = {
    gte: DateTime.fromISO(startDate).toISO(),
    lte: DateTime.fromISO(endDate).toISO(),
  };

  const username = session.user.name;

  switch (function_name) {
    case "get":
      let itemList = [];
      const queryObj = {
        where: {
          createdAt: timeConstraint,
        },
        include: {
          owner: true,
        },
        orderBy: [
          {
            updatedAt: "desc",
          },
        ],
      };
      if (adminUsernameList.includes(username)) {
        itemList = await FitbitDataHelper.findFitbitDataByCriteria(queryObj);
      }
      res.status(200).json({ result: itemList });
      return;
    default:
      return;
  }
}
