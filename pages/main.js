import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
/*
import logger from "../lib/logger";

*/

import { Button } from "@mui/material";

import { inspect } from "util";

import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import md5 from "md5";
import FitbitHelper from "../lib/FitbitHelper";

import prisma from "../lib/prisma.mjs";

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log(`main.getServerSideProps: session: ${JSON.stringify(session)}`);

  if (!session) {
    return {
      props: {},
    };
  }

  let userName = session.user.name;

  const user = await prisma.users.findFirst({
    where: { username: userName },
  });

  console.log(`main.getServerSideProps: user: ${JSON.stringify(user)}`);

  const userInfo = JSON.parse(JSON.stringify(user, replacer));

  console.log(`name: ${userName} - fitbiId: ${user.fitbitId}`);
  let hasFitbitConnection =
    user.fitbitId != undefined &&
    user.accessToken != undefined &&
    user.refreshToken != undefined;

  let isAccessTokenActive = false;

  const introspectResult = await FitbitHelper.introspectToken(user.accessToken)
    .then((responseData) => {
      console.log(
        `main.FitbitHelper.introspectToken: ${JSON.stringify(responseData)}`
      );
      //isAccessTokenActive = responseData.active;
      return responseData;
    })
    .catch((error) => {
      let resultObj = {};
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`Data: ${error.response.data}`);
        console.log(`Status: ${error.response.status}`);
        console.log(`StatusText: ${error.response.statusText}`);
        console.log(`Headers: ${error.response.headers}`);

        console.log(`Error response`);
        resultObj = eval(`(${inspect(error.response.data)})`);
        // which means, authentication falil
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);

        console.log(`Error request`);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);

        console.log("Error else");
      }
      //res.status(error.response.status).json({ response: inspect(error.response.data) });

      return { value: "failed", data: resultObj };
    });

  console.log(
    `main.getServerSideProps: introspectResult: ${JSON.stringify(
      introspectResult
    )}`
  );

  //isAccessTokenActive = introspectResult.active;

  return {
    props: {
      userInfo,
      hasFitbitConnection,
      isAccessTokenActive,
      introspectResult,
    },
  };
}

export default function Main({
  userInfo,
  hasFitbitConnection,
  isAccessTokenActive,
  introspectResult,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  //logger.logToDB("main", {message: "test"});

  //const [value1, setValue1] = useState('');
  //const [value2, setValue2] = useState('');

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);

  console.log(`introspectResult: ${JSON.stringify(introspectResult)}`);
  // username=${session.user.username}
  let redirectURL = `https://walktojoy.net/fitbit-signin`;

  let state = `auth-walktojoy-${md5(session.user.name)}`;

  // Tutorial example: https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=https%3A%2F%2Fwalktojoy.net%2Ffitbit-signin&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800

  // long: activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  // short: activity%20profile%20settings%20

  let scope = "activity%20profile%20settings%20";

  let fitbitSignInLink = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=${encodeURIComponent(
    redirectURL
  )}&state=${state}&scope=${scope}&expires_in=604800`;

  async function sendTwilioMessage(phone, messageBody) {
    console.log(`Main.sendTwilioMessage: ${phone} - ${messageBody}`);

    const result = await fetch("/api/twilio?function_name=send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        messageBody,
      }),
    }).then((r) => {
      return r.json();
    });

    return result;
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
          <Image
            //loader={myLoader}
            src="/image/gif/happy-dog-1.gif"
            alt="Picture of the author"
            width={250}
            height={250}
          />
          <Divider />
          <br />
          <div>Signed in as {session.user.name} </div>
          <br />
          <div>
            Fitbit: {hasFitbitConnection ? "connected" : "not connected"}
          </div>
          <br />
          <div>
            Access Token (not working yet):{" "}
            {isAccessTokenActive ? "active" : "inactive"}
          </div>
          <br />
          <Divider />
          <br />
          <Link href={fitbitSignInLink}>
            <Button variant="contained" style={{ width: "100%" }}>
              Connect your Fitbit
            </Button>
          </Link>
          <br />
          <br />
          <Link href={"/activity-summary"}>
            <Button variant="contained" style={{ width: "100%" }}>
              Get Activity Summary
            </Button>
          </Link>
          <br />
          <br />
          <Link href={"/time-setting"}>
            <Button variant="contained" style={{ width: "100%" }}>
              Set Time Preference
            </Button>
          </Link>
          <br />
          <br />

          <Link href={"/info-edit"}>
            <Button variant="contained" style={{ width: "100%" }}>
              Edit Preferred Name and Phone
            </Button>
          </Link>
          <br />
          <br />

          <Button
            variant="contained"
            style={{ width: "100%" }}
            onClick={(event) => {
              sendTwilioMessage(
                userInfo.phone,
                `Hello ${userInfo.preferredName}`
              );
            }}
          >
            Send myself hello SMS
          </Button>
          <br />
          <br />

          <Link href="/home">
            <a>Personalize your Experience</a>
          </Link>
          <br />
          <br />
          <Link href="/home">
            <a>Complete the Baseline Survey</a>
          </Link>
          <br />
          <br />
          <Link href="/home">
            <a>Disable Sedentary Notification on your Fitbit application</a>
          </Link>
          <br />
          <br />
          <Divider />
          <br />
        </div>
        <div>
          <Button
            variant="outlined"
            color="error"
            style={{ width: "100%" }}
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
        <div>
          <p>1/4 complete</p>
          <p>
            Once all tasks are completed, your study will be activiated the
            upcoming Monday for the duration of 6 weeks.
          </p>
        </div>
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
