import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

//import logger from "../lib/logger";
//import prisma from '../lib/prisma';

import prisma from "../lib/prisma";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import FitbitHelper from "../lib/FitbitHelper.mjs";
import { inspect } from 'util';

/*
function replacer(key, value) {
  if (typeof value === 'Date') {
    return value.toString();
  }
  return value;
}

export const getServerSideProps = async ({ req }) => {
  // const token = req.headers.AUTHORIZATION
  // const userId = await getUserId(token)\

  //const logs = await prisma.log.findMany();

  //const logList = JSON.parse(JSON.stringify(logs, replacer));

  return {
    props : {  }
  }
}
*/

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

export async function getServerSideProps({ query }) {
  const { code, state } = query;

  let authCode = code;
  let stateSplit = state.split("-");
  let hashCode = stateSplit[2];

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

      /*
      if(responseData.status == 400){
          // cannot auth: Bad Request
          // I supposed this mean we need to authenticate again
      }
      */

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


    const profileResult = await FitbitHelper.getProfile(accessToken)
      .then((responseData) => {
        let rUser = responseData.user;

        let fId = rUser.encodedId;
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
    props: { result: [authResult, profileResult]},
  };
}

export default function FitbitSignin({result}) {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    <div className={styles.container}>
      <Head>
        <title>Walk To Joy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        
        <div>
        {
          combinedResult? <h1 className={styles.title}>Fitbit connection success!</h1>: <h1 className={styles.title}>Fitbit connection failed!</h1>
        }
        </div>
        <div>
        {
          !combinedResult? <div>{message}</div>:null
        }
        </div>

        <Button
          label="Return to settings"
          className="p-button-danger"
          onClick={() => {
            router.push("/main");
            return;
          }}
        />
      </main>

      <footer className={styles.main}>
        <div>WalkToJoy Study</div>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>School of Informaiton</div>
          <div>University of Michigan</div>
        </a>
      </footer>
    </div>
  );
}

/*

<div>Please do not share your participant ID and token with others.</div>

<div>Participant ID</div>
        <InputText value={value1} placeholder={"Enter your participant ID"} onChange={(e) => setValue1(e.target.value)} />
        <Password value={value2} placeholder={"Enter your 8-digit token"} feedback={false} onChange={(e) => setValue2(e.target.value)} toggleMask />
*/

/*
<div>
{
  logList.map((log, index) => {
    return <div key={index}>
      <div>{log.type}</div>
      <div>{log.createdAt}</div>
      <div>{JSON.stringify(log.content)}</div>
    </div>;
  })
}
</div>
*/

/*
      <footer className={styles.footer}>
        <div>
          WalkToJoy Study
        </div>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>School of Informaiton</div>
        <div>University of Michigan</div>
          
        </a>
      </footer>


Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>



        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>


<div className={styles.grid}>
<a href="https://nextjs.org/docs" className={styles.card}>
  <h2>Documentation &rarr;</h2>
  <p>Find in-depth information about Next.js features and API.</p>
</a>

<a href="https://nextjs.org/learn" className={styles.card}>
  <h2>Learn &rarr;</h2>
  <p>Learn about Next.js in an interactive course with quizzes!</p>
</a>

<a
  href="https://github.com/vercel/next.js/tree/canary/examples"
  className={styles.card}
>
  <h2>Examples &rarr;</h2>
  <p>Discover and deploy boilerplate example Next.js projects.</p>
</a>

<a
  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
  className={styles.card}
>
  <h2>Deploy &rarr;</h2>
  <p>
    Instantly deploy your Next.js site to a public URL with Vercel.
  </p>
</a>
</div>
*/
