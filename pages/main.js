import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
/*
import logger from "../lib/logger";

*/


import { toast } from "react-toastify";

import { Button } from "@mui/material";

import { inspect } from "util";

import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, Fragment } from "react";
import Divider from "@mui/material/Divider";
import md5 from "md5";
import FitbitHelper from "../lib/FitbitHelper";
import GeneralUtility from "../lib/GeneralUtility";
import prisma from "../lib/prisma.mjs";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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

  const introspectResult = await FitbitHelper.introspectToken(
    user.accessToken,
    user.accessToken
  )
    .then((responseData) => {
      console.log(
        `main.FitbitHelper.introspectToken: ${JSON.stringify(responseData)}`
      );
      isAccessTokenActive = responseData.active == true;
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

  let hostURL = `${process.env.NEXTAUTH_URL}`;

  return {
    props: {
      userInfo,
      hasFitbitConnection,
      isAccessTokenActive,
      introspectResult,
      hostURL,
    },
  };
}

export default function Main({
  userInfo,
  hasFitbitConnection,
  isAccessTokenActive,
  introspectResult,
  hostURL,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [displaySetting, setDisplaySetting] = useState("all");

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
  let redirectURL = `${hostURL}/fitbit-signin`;

  let state = `auth-walktojoy-${md5(session.user.name)}`;

  // Tutorial example: https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=https%3A%2F%2Fwalktojoy.info%2Ffitbit-signin&scope=activity%20heartrate%20profile%20settings&expires_in=604800

  // long: activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  // short: activity%20profile%20settings%20

  let scope = "activity%20heartrate%20profile%20settings";

  let fitbitSignInLink = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=${encodeURIComponent(
    redirectURL
  )}&state=${state}&scope=${scope}&expires_in=604800`;

  // move it to GeneralUtility
  /*
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
  */

  const handleChange = (event, newSetting) => {
    setDisplaySetting(newSetting);
  };

  const control = {
    value: displaySetting,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Walk To Joy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <ToggleButtonGroup {...control}>
            <ToggleButton value="incomplete" key="incomplete">
              Incomplete
            </ToggleButton>
            <ToggleButton value="all" key="all">
              All
            </ToggleButton>
          </ToggleButtonGroup>
          <br />
          <br />
          <Divider />
          <br />
          <div>Signed in as {session.user.name} </div>
          <br />
          <div>
            Fitbit:{" "}
            {GeneralUtility.doesFitbitInfoExist(userInfo)
              ? "connected"
              : "not connected"}
          </div>
          <br />
          <div>Access Token: {isAccessTokenActive ? "active" : "inactive"}</div>
          <br />
          <Divider />
          <br />
          {displaySetting == "all" ||
          !GeneralUtility.isPreferredNameSet(userInfo) ? (
            <Fragment>
              <Link href={"/info-edit"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Personalize your Experience
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}
          {displaySetting == "all" ||
          !GeneralUtility.isWakeBedTimeSet(userInfo) ? (
            <Fragment>
              <Link href={"/time-setting"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Set Time Preference
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}
          {displaySetting == "all" ||
          !GeneralUtility.doesFitbitInfoExist(userInfo) ? (
            <Fragment>
              <Link href={fitbitSignInLink}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Authorize your Fitbit
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}
          
          {displaySetting == "all" ? (
            <Fragment>
              <Link href={"https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Complete the baseline survey
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}

          
          
          {displaySetting == "all" ? (
            <Fragment>
              <Link href={"/group-setting"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Set Group Assignment
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}
          {displaySetting == "all" ? (
            <Fragment>
              <Link href={"/"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Turn off Fitbit reminders to move
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}
          {displaySetting == "all" ? (
            <Fragment>
              <Link href={"/"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Save WalkToJoy to your contacts
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}


            <br />
            <br />
            <Divider />
            {displaySetting == "all" ? (
            <Fragment>
              <Link href={"/get-activity-summary"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Get Activity Summary (1 step process)
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}

          {displaySetting == "all" ? (
            <Fragment>
              <Link href={"/activity-summary"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Activity Summary (2 step process)
                </Button>
              </Link>
              <br />
              <br />
            </Fragment>
          ) : null}

          {displaySetting == "all" ? (
            <Fragment>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={(event) => {
                  GeneralUtility.sendTwilioMessage(
                    userInfo.phone,
                    `Hello ${userInfo.preferredName}`
                  );
                  toast(`Hello ${userInfo.preferredName}`);
                }}
              >
                Send myself hello SMS
              </Button>
              <br />
              <br />
            </Fragment>
          ) : null}
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
          <div>School of Information</div>
          <div>University of Michigan</div>
        </a>
      </footer>
    </div>
  );
}
