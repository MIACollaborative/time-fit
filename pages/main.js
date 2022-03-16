import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import "primereact/resources/themes/nova/theme.css"
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
/*
import logger from "../lib/logger";

*/

import { inspect } from 'util';
import prisma from '../lib/prisma';
import Link from 'next/link';
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import md5 from "md5";
import FitbitHelper from '../lib/FitbitHelper.mjs';

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

  const logs = await prisma.log.findMany();

  const logList = JSON.parse(JSON.stringify(logs, replacer));

  return {
    props : { logList }
  }
}
*/


export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log(
      `main.getServerSideProps: session: ${JSON.stringify(session)}`
  );

  let userName = session.user.name;

  const user = await prisma.users.findFirst({
      where: { username: userName },
  });


  let hasFitbitConnection = user.fitbiId != "" && user.accessToken != "" && user.refreshToekn != "";


  let isAccessTokenActive = false;

  const refreshResult = await FitbitHelper.refreshToken(user.refreshToken)
      .then((responseData) => {
          console.log(
              `FitbitHelper.refreshToken: ${JSON.stringify(
                  responseData
              )}`
          );

          /*
          if(responseData.status == 400){
              // cannot auth: Bad Request
              // I supposed this mean we need to authenticate again
          }
          */


          /*
          {
            "access_token": "eyJhbGciOiJIUzI1...",
            "expires_in": 28800,
            "refresh_token": "c643a63c072f0f05478e9d18b991db80ef6061e...",
            "token_type": "Bearer",
            "user_id": "GGNJL9"
          }
          */

          let newAccessToken = responseData.access_token;

          // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
          let newRefreshToken = responseData.refresh_token;

          // To Do: ideally, store both
          updateToken(user.hash, newAccessToken, newRefreshToken);

          return { value: "success", data: responseData };

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

          return { value: "failed", data: inspect(error.response.data) };
      });

  const introspectResult = await FitbitHelper.introspectToken(user.accessToken)
      .then((responseData) => {
        isAccessTokenActive = responseData.active;
      })
      .catch((error) => {return error;})

  return {
      props: { hasFitbitConnection, isAccessTokenActive},
  };
}


export default function Main({hasFitbitConnection, isAccessTokenActive}) {

  const { data: session, status } = useSession();
  const router = useRouter();

  //logger.logToDB("main", {message: "test"});

  //const [value1, setValue1] = useState('');
  //const [value2, setValue2] = useState('');

  

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session){
    router.push('/');
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);
  // username=${session.user.username}
  let redirectURL = `https://walktojoy.net/fitbit-signin`;

  let state = `auth-walktojoy-${md5(session.user.name)}`;

  // Tutorial example: https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=https%3A%2F%2Fwalktojoy.net%2Ffitbit-signin&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800

  // long: activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  // short: activity%20profile%20settings%20

  let scope = "activity%20profile%20settings%20";

  let fitbitSignInLink = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=${encodeURIComponent(redirectURL)}&state=${state}&scope=${scope}&expires_in=604800`;

  return (
    <div className={styles.container}>
      <Head>
        <title>Walk To Joy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

      
      <div>
        <div>Signed in as {session.user.name} </div><br />
        <div>Fitbit: {hasFitbitConnection? "connected": "not connected"}</div><br />
        <div>Access Token: {isAccessTokenActive? "active": "inactive"}</div><br />
        <Divider />
        <Link href={fitbitSignInLink}><Button label="Connect your Fitbit" className="p-button-info" style={{width: "100%"}}/></Link><br /><br />


        <Link href={"/activity-summary"}><Button label="Get Activity Summary" className="p-button-info" style={{width: "100%"}}/></Link><br /><br />

        
        <Link href="/home"><a>Personalize your Experience</a></Link><br /><br />
        <Link href="/home"><a>Complete the Baseline Survey</a></Link><br /><br />
        <Link href="/home"><a>Disable Sedentary Notification on your Fitbit application</a></Link><br /><br />
        <Divider />
        
      </div>
      <div><Button label="Sign out" className="p-button-danger" onClick={() => signOut()}/></div>
      <div>
        <p>1/4 complete</p>
        <p>Once all tasks are completed, your study will be activiated the upcoming Monday for the duration of 6 weeks.</p>

      </div>
      

      </main>

      <footer className={styles.main}>
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
    </div>
  )
}
