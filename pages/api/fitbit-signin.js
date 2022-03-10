import prisma from "../../lib/prisma";
import FitbitHelper from "../../lib/FitbitHelper.mjs";

export default async function handler(req, res) {
  const { code, state } = req.query;
  //const { type, content } = req.body;

  console.log(`authCode: ${code}`);
  console.log(`state: ${state}`);

  let authCode = code;
  let stateSplit = state.split("-");
  let hashCode = stateSplit[2];

  const user = await prisma.users.findFirst({
    where: { hash: hashCode}
  });

  return FitbitHelper.getAuthorizationInformation(authCode).then(
    (responseData) => {
      console.log(
        `FitbitHelper.getAuthorizationInformation: ${JSON.stringify(
          responseData
        )}`
      );

      let accessToken = responseData.access_token;

      // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
      let refreshToken = responseData.refresh_toekn;

      // To Do: ideally, store both
      const updateUser = await prisma.user.update({
        where: { hash: hashCode},
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken
        },
      })

      return {username: user.username, accessToken, refreshToken };
    }
  );
}
