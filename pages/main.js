import Layout from '../component/Layout';
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
import DatabaseUtility from "../lib/DatabaseUtility.mjs";

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

  /*
  if (!session) {
    return {
      props: {},
    };
  }
  */

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

  // baseline survey completed
  let isBaselineSurveyCompleted = await DatabaseUtility.isSurveyCompleted("SV_81aWO5sJPDhGZNA");

  console.log(`main.getServerSideProps: isBaselineSurveyCompleted: ${isBaselineSurveyCompleted}`);
  //isAccessTokenActive = introspectResult.active;

  let hostURL = `${process.env.NEXTAUTH_URL}`;

  return {
    props: {
      userInfo,
      hasFitbitConnection,
      isAccessTokenActive,
      isBaselineSurveyCompleted,
      introspectResult,
      hostURL,
    },
  };
}

export default function Main({
  userInfo,
  hasFitbitConnection,
  isAccessTokenActive,
  isBaselineSurveyCompleted,
  introspectResult,
  hostURL,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [displaySetting, setDisplaySetting] = useState("all");


  console.log(`Main.userInfo: ${JSON.stringify(userInfo)}`);

  //logger.logToDB("main", {message: "test"});

  //const [value1, setValue1] = useState('');
  //const [value2, setValue2] = useState('');

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

  async function getInfo(
    username
  ) {
    console.log(`Main.getInfo: ${username}`);

    const result = await fetch(
      "/api/user?function_name=get_info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username
        }),
      }
    ).then((r) => {
      return r.json();
    });

    return result;
  }

  /*
  name
  time preference
  fitbit
  turn off fitbit
  add contacts

  Baseline UI
  - Baseline survey
  - Fibit Authorized

  Intervention UI
  - Re-authorize Fitbit
  */

  if(!GeneralUtility.isPreferredNameSet(userInfo)){
    router.push("/info-edit");
    return null;
  }
  else if(!GeneralUtility.isWakeBedTimeSet(userInfo)){
    router.push("/time-setting");
    return null;
  }
  // GeneralUtility.doesFitbitInfoExist(userInfo)
  else if(false && !GeneralUtility.doesFitbitInfoExist(userInfo)){
    // likely the first time signing in
    router.push("/fitbit-authorize");
    return null;
  }
  else if(!GeneralUtility.isFitbitReminderTurnOff(userInfo)){
    router.push("/turn-off-fitbit-reminder");
    return null;
  }
  else if(!GeneralUtility.isWalkToJoySaveToContacts(userInfo)){
    router.push("/save-walktojoy-to-contacts");
    return null;
  }
  /*
  else if(!isBaselineSurveyCompleted){
    // baselineSurveyLink
    return <div>Baseline survey is not completed</div>;
    return null;
  }
  */




  console.log(`session: ${JSON.stringify(session)}`);

  console.log(`introspectResult: ${JSON.stringify(introspectResult)}`);
  // username=${session.user.username}
  //let redirectURL = `${hostURL}/fitbit-signin`;

  //let state = `auth-walktojoy-${md5(session.user.name)}`;

  // Tutorial example: https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=https%3A%2F%2Fwalktojoy.info%2Ffitbit-signin&scope=activity%20heartrate%20profile%20settings&expires_in=604800

  // long: activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  // short: activity%20profile%20settings%20


  const fitbitAuthorizeLink = "/fitbit-authorize";

  const baselineSurveyLink = `https://umich.qualtrics.com/jfe/form/SV_81aWO5sJPDhGZNA`;


  const handleChange = (event, newSetting) => {
    setDisplaySetting(newSetting);
  };

  const control = {
    value: displaySetting,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <Layout title={"Walk To Joy"} description={""}>
    <div>
          <ToggleButtonGroup {...control} style={{display: "none"}}>
            <ToggleButton value="incomplete" key="incomplete">
              Incomplete
            </ToggleButton>
            <ToggleButton value="all" key="all">
              All
            </ToggleButton>
          </ToggleButtonGroup>
          
          <h1 className="project-text">Hi {userInfo.preferredName},</h1>
          <p>
          {
            userInfo.phase == "baseline"? `You are now in a baseline week for 7 days.`: `The study is currently active.` 
          }
          </p>
          <p>
          {
            userInfo.phase == "baseline"? `During the 7 days, we ask that you:`: `During the 6 weeks, we ask that you:` 
          }
          </p>
          <p></p>
          <ol>
            <li>Keep your Fitbit authorized, and continue to wear your Fitbit device for at least 8 hoours each day.</li>

            {
              userInfo.phase == "baseline"? <li>Complete the Baseline Survey</li>: null 
            }

            {
              userInfo.phase == "intervention"? <li>Continue to wear your Fitbit device for at least 8 hours each day.</li>: null 
            }

            {
              userInfo.phase == "intervention"? <li>Complete all surveys your receive.</li>: null 
            }
            
          </ol>
          <br />
          <br />
          <Fragment>
              <Link href={baselineSurveyLink}>
                <Button 
                variant="contained" 
                  className={isBaselineSurveyCompleted? "project-button-complete": "project-button-incomplete"}
                >
                  {isBaselineSurveyCompleted? `Baseline Survey Completed`:"Complete the Baseline Survey"}
                  
                </Button>
              </Link>
              <br />
              <br />
          </Fragment>
          <Fragment>
              <Link href={GeneralUtility.doesFitbitInfoExist(userInfo)? "/": fitbitAuthorizeLink}>
                <Button 
                variant="contained" 
                className={GeneralUtility.doesFitbitInfoExist(userInfo)? "project-button-complete": "project-button-incomplete"}
                  >
                  {GeneralUtility.doesFitbitInfoExist(userInfo)? "Fitbit Authorized": "Authorize your Fitbit"}
                </Button>
              </Link>
              <br />
              <br />
          </Fragment>

          <p>
          {
            userInfo.phase == "baseline"? `Following the 7 days, the study will be activated for the duration of 6 weeks.`: null
          }
          </p>
          <p>
          {
            userInfo.phase == "baseline"? `Thank you for your contribution.`: null
          }
          </p>
          <Divider />
          <br />
          <div>[Debug]</div>
          <div>Signed in as {session.user.name} </div>
          <div>Phase: {userInfo.phase} </div>
          <div>joinAt: {userInfo.joinAt} </div>
          <div>activateAt: {userInfo.activateAt} </div>
          <div>Baseline survey completed: {JSON.stringify(isBaselineSurveyCompleted)} </div>
          <div>
            Fitbit:{" "}
            {GeneralUtility.doesFitbitInfoExist(userInfo)
              ? "connected"
              : "not connected"}
          </div>
          <div>Access Token: {isAccessTokenActive ? "active" : "inactive"}</div>
          <br />
          <Divider />
          {
            displaySetting == "all" ?
            <Fragment>
              <br />
              <div>For testing:</div>
              <br />
            </Fragment>: null
          }

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
              <Link href={"/get-heartrate"}>
                <Button variant="contained" style={{ width: "100%" }}>
                  Get HeartRate (1 step process)
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
    </Layout>

  );
}

// style={{ width: "100%" }} color={GeneralUtility.doesFitbitInfoExist(userInfo)? "success":"primary"}

// style={{ width: "100%" }} color={isBaselineSurveyCompleted? "success":"primary"}

/*
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

*/

/*
          <Fragment>
              <Link href={"/time-setting"}>
                <Button variant="contained" style={{ width: "100%" }} color={GeneralUtility.isWakeBedTimeSet(userInfo)? "success":"primary"}>
                  Personalize your Experience
                </Button>
              </Link>
              <br />
              <br />
          </Fragment>
          <Fragment>
              <Link href={baselineSurveyLink}>
                <Button variant="contained" style={{ width: "100%" }} color={isBaselineSurveyCompleted? "success":"primary"}>
                  Complete the Baseline Survey
                </Button>
              </Link>
              <br />
              <br />
          </Fragment>
          <Fragment>
            <Link href={fitbitSignInLink}>
              <Button variant="contained" style={{ width: "100%" }} color={GeneralUtility.doesFitbitInfoExist(userInfo)? "success":"primary"}>
                Authorize your Fitbit
              </Button>
            </Link>
            <br />
            <br />
          </Fragment>
          <Fragment>
            <Link href={'/turn-off-fitbit-reminder'}>
              <Button variant="contained" style={{ width: "100%" }} color={GeneralUtility.isFitbitReminderTurnOff(userInfo)? "success":"primary"}>
                Turn off Fitbit reminders to move
              </Button>
            </Link>
            <br />
            <br />
          </Fragment>
          <Fragment>
            <Link href={'/save-walktojoy-to-contacts'}>
              <Button variant="contained" style={{ width: "100%" }} color={GeneralUtility.isWalkToJoySaveToContacts(userInfo)? "success":"primary"}>
                Save WalkToJoy to your Contacts
              </Button>
            </Link>
            <br />
            <br />
          </Fragment>
*/
