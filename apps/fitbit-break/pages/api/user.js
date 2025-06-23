import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import cryptoRandomString from "crypto-random-string";
import bcrypt from "bcrypt";
import UserInfoHelper from "@time-fit/helper/UserInfoHelper.js";
import ObjectHelper from "@time-fit/helper/ObjectHelper.js";

const adminUsernameList = ["test1", "test2", "test3", "test4"];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log(`user - session: ${JSON.stringify(session)}`);
  if (!session) {
    res.status(401).json({});
    res.end();
    return;
  }

  const { function_name } = req.query;
  console.log(`user - function_name: ${function_name}`);

  let sessionUserName = session.user.name;

  const { username, ...rest } = req.body;

  switch (function_name) {
    case "get":
      let itemList = [];
      if (adminUsernameList.includes(sessionUserName)) {
        itemList = await UserInfoHelper.getUsers();
      }
      res.status(200).json({ result: itemList });
      return;
    case "update_time_preference":
      const { weekdayWakeup, weekdayBed, weekendWakeup, weekendBed, timezone } =
        req.body;
      const updateUser = await UserInfoHelper.updateUserInfo(
        { username: sessionUserName },
        {
          weekdayWakeup,
          weekdayBed,
          weekendWakeup,
          weekendBed,
          timezone,
        }
      );

      res.status(200).json({ result: "success" });
      return;
    case "update_group_assignment":
      const updateGroupUser = await UserInfoHelper.updateUserInfo(
        { username: sessionUserName },
        {
          groupMembership: req.body,
        }
      );
      res.status(200).json({ result: "success" });
      return;
    case "update_info":
      console.log(`user - rest: ${JSON.stringify(rest)}`);
      const { password, ...pRest } = rest;
      if (password != undefined) {
        if (adminUsernameList.includes(sessionUserName)) {
          const aUser = await UserInfoHelper.updateUserInfo(
            { username: sessionUserName },
            rest
          );
        } else {
          const aUser = await UserInfoHelper.updateUserInfo(
            { username: sessionUserName },
            pRest
          );
        }
      } else {
        const aUser = await UserInfoHelper.updateUserInfo(
          { username: sessionUserName },
          rest
        );
      }

      res.status(200).json({ result: "success" });
      return;
    case "generate_new_password":
      let saltRounds = 10;
      let pass = cryptoRandomString({
        length: 8,
        characters: "abcdefghijkmnpqrstuvwxyz023456789",
      });
      let passwordHash = await bcrypt
        .hash(pass, saltRounds)
        .then((hashPassword) => {
          // Store hash in your password DB.
          return hashPassword;
        });
      res.status(200).json({
        result: {
          password: pass,
          passwordHash,
        },
      });
      return;
    case "reset":
      let deleteValue = {
        unset: true,
      };

      let result = undefined;

      if (adminUsernameList.includes(sessionUserName)) {
        const resetUser = await UserInfoHelper.updateUserInfo(
          { username: sessionUserName },
          {
            preferredName: deleteValue,
            phone: deleteValue,
            timezone: deleteValue,
            phase: "baseline",
            joinAt: deleteValue,
            activateAt: deleteValue,
            completeAt: deleteValue,
            fitbitReminderTurnOff: false,
            saveWalkToJoyToContacts: false,
            autoWalkTo10: false,
            fitbitId: deleteValue,
            fitbitDisplayName: deleteValue,
            fitbitFullName: deleteValue,
            accessToken: deleteValue,
            refreshToken: deleteValue,
            weekdayWakeup: deleteValue,
            weekdayBed: deleteValue,
            weekendWakeup: deleteValue,
            weekendBed: deleteValue,
          }
        );
        result = resetUser;
      }
      res.status(200).json({ result: result });
      return;
    case "get_info":
      const user = await UserInfoHelper.getUserInfoByUsername({
        username: sessionUserName,
      });
      const userInfo = JSON.parse(JSON.stringify(user, ObjectHelper.convertDateToString));
      res.status(200).json({ result: userInfo });
      return;
    default:
      return;
  }
}
