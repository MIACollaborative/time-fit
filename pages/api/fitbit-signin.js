import prisma from "../../lib/prisma";
import FitbitHelper from "../../lib/FitbitHelper.mjs";
import { inspect } from 'util' 

export default async function handler(req, res) {
  const { code, state } = req.query;
  //const { type, content } = req.body;

  console.log(`authCode: ${code}`);
  console.log(`state: ${state}`);

  async function updateToken(hashCode, accessToken, refreshToken) {
    console.log(`updateToken, hashCode: ${hashCode}`);
    console.log(`updateToken, accessToken: ${accessToken}`);
    console.log(`updateToken, refreshToken: ${refreshToken}`);
    const firstUser = await prisma.users.findFirst({
      where: { hash: hashCode },
    });

    console.log(`firstUser: ${JSON.stringify(firstUser)}`);

    const updateUser = await prisma.users.update({
      where: { username: firstUser.username },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });

    console.log(`updateUser: ${JSON.stringify(updateUser)}`);
  }

  let authCode = code;
  let stateSplit = state.split("-");
  let hashCode = stateSplit[2];

  console.log(`hash: ${hashCode}`);

  const user = await prisma.users.findFirst({
    where: { hash: hashCode },
  });

  return FitbitHelper.getAuthorizationInformation(authCode)
    .then((responseData) => {
      console.log(
        `FitbitHelper.getAuthorizationInformation: ${JSON.stringify(
          responseData
        )}`
      );

      /*
      if(responseData.status == 400){
          // cannot auth: Bad Request
          // I supposed this mean we need to authenticate again
      }
      */

      let accessToken = responseData.access_token;

      // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
      let refreshToken = responseData.refresh_toekn;

      // To Do: ideally, store both
      updateToken(hashCode, accessToken, refreshToken);

      res.status(200).json({ message: "authentication success" });
      //return {message: "authentication success"}; //res.status(200).end();
      //return {username: user.username, accessToken, refreshToken };
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`Data: ${error.response.data}`);
        console.log(`Status: ${error.response.status}`);
        console.log(`StatusText: ${error.response.statusText}`);
        console.log(`Headers: ${error.response.headers}`);

        console.log(`Error response`);
        // which means, authentication falil
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);

        console.log(`Error request`);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);

        console.log("Error else");
      }
      res
        .status(error.response.status)
        .json({ response: inspect(error.response) });
    });
}
