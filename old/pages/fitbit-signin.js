
import styles from "../styles/Home.module.css";
import Layout from "../component/Layout";
import prisma from "../lib/prisma";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import LinearProgress  from "@mui/material/LinearProgress";
import Button from '@mui/material/Button';
import FitbitHelper from "../lib/FitbitHelper.mjs";
import { inspect } from 'util';
import { Fragment } from "react";

export async function getServerSideProps({ query }) {
  const { code, state } = query;

  let authCode = code;
  let stateSplit = state.split("-");
  let hashCode = stateSplit[2];

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
  
  
  async function updateFitbitProfile(hashCode, fitbitId, fitbitDisplayName, fitbitFullName) {
    console.log(`updateFitbitId, hashCode: ${hashCode}`);
    console.log(`updateFitbitId, fitbitId: ${fitbitId}`);
    console.log(`updateFitbitId, fitbitDisplayName: ${fitbitDisplayName}`);
    console.log(`updateFitbitId, fitbitFullName: ${fitbitFullName}`);
  
    const firstUser = await prisma.users.findFirst({
      where: { hash: hashCode },
    });
  
    console.log(`firstUser: ${JSON.stringify(firstUser)}`);
  
    const updateUser = await prisma.users.update({
      where: { username: firstUser.username },
      data: {
        fitbitId: fitbitId,
        fitbitDisplayName: fitbitDisplayName,
        fitbitFullName: fitbitFullName
      },
    });
  
    console.log(`updateUser: ${JSON.stringify(updateUser)}`);
  }

  const user = await prisma.users.findFirst({
    where: { hash: hashCode },
  });

  let accessToken = "";
  let refreshToken = "";

  const authResult = await FitbitHelper.getAuthorizationInformation(authCode)
    .then((responseData) => {
      console.log(
        `FitbitHelper.getAuthorizationInformation: ${JSON.stringify(
          responseData
        )}`
      );

      accessToken = responseData.access_token;

      // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
      refreshToken = responseData.refresh_token;

      // To Do: ideally, store both
      updateToken(hashCode, accessToken, refreshToken);

      return {value: "success", stage: "authentication"};

      //res.status(200).json({ message: "authentication success" });
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
      //res.status(error.response.status).json({ response: inspect(error.response.data) });

      return {value: "failed", stage: "authentication", data: inspect(error.response.data)};
    });

    let fitbitId = "";

    const profileResult = await FitbitHelper.getProfile(accessToken)
      .then((responseData) => {
        let rUser = responseData.user;

        let fId = rUser.encodedId;
        fitbitId = fId;
        let fDisplayName = rUser.displayName;
        let fFullName = rUser.fullName;

        updateFitbitProfile(hashCode, fId, fDisplayName, fFullName);


        return {value: "success", stage: "profile"};

      })
      .catch((error) => {
        console.log();
        return {value: "failed", stage: "profile"};
      })

  return {
    props: { result: {authResult, profileResult}, fitbitId},
  };
}

export default function FitbitSignin({result, fitbitId}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFitbitLoading, setFitbitLoading] = useState(false);

  useEffect(() => {
    setFitbitLoading(true)
    fetch('/api/manage-fitbit-subscription?function_name=create_subscriptions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fitbitId: fitbitId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFitbitLoading(false)
      })
  }, []);

  if (status == "loading") return <div>loading...</div>;
  if (!session){
    router.push('/');
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);


  let combinedResult = result.authResult.value == "success" && result.profileResult.value == "success";

  if(!combinedResult){
    let message = "";

    if(result.authResult.value == "failed"){
      message += "Fail to authenticate!\n";
    }

    if(result.profileResult.value == "failed"){
      message += "Fail to retrieve profile information.!\n";
    }
  }



  return (
    <Layout title={"Walk To Joy"} description={""}>
        
        <div>
        {
          combinedResult? <h1 className={styles.title}>Fitbit authorized success!</h1>: <h1 className={styles.title}>Fitbit connection failed!</h1>
        }
        </div>
        <div>
        {
          !combinedResult? <div>{message}</div>:null
        }
        </div>

        <div>
          {
            isFitbitLoading? <Fragment>
              <div>Give us a few seconds to wrap things up!</div>
              <LinearProgress></LinearProgress>
            </Fragment>: null
          }
          

        </div>

        <Button variant="contained" 
        className="project-button"
        disabled={isFitbitLoading} onClick={(event) => {
            router.push("/main");
            return;
          }} >Done</Button>


    </Layout>
  );
}
