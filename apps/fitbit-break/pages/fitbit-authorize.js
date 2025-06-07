import Layout from "../component/Layout";
import md5 from "md5";

import TextField from "@mui/material/TextField";
/*
import logger from "../lib/logger";

*/

import GeneralUtility from "../lib/GeneralUtility.mjs";

import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import prisma from "../lib/prisma.mjs";
import { DateTime } from "luxon";

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
      props: {userInfo:{}},
    };
  }

  let userName = session.user.name;

  const uniqueUser = await prisma.users.findFirst({
    where: { username: userName },
  });

  console.log(`main.getServerSideProps: user: ${JSON.stringify(uniqueUser)}`);

  const userInfo = JSON.parse(JSON.stringify(uniqueUser, replacer));

  let hostURL = `${process.env.HOST_URL}`;
  return {
    props: { userInfo, hostURL },
  };
}

export default function FitbitAuthorize({ userInfo, hostURL }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(`FitbitAuthorize.userInfo: ${JSON.stringify(userInfo)}`);


  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);



  let redirectURL = `${hostURL}/fitbit-signin`;

  let state = `auth-walktojoy-${md5(session.user.name)}`;

  // Tutorial example: https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=process.env.FITBIT_CLIENT_ID&redirect_uri=https%3A%2F%2Fwalktojoy.info%2Ffitbit-signin&scope=activity%20heartrate%20profile%20settings&expires_in=604800

  // long: activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  // short: activity%20profile%20settings%20

  let scope = "activity%20heartrate%20profile%20settings";

  let fitbitSignInLink = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectURL
  )}&state=${state}&scope=${scope}&expires_in=604800`;

  return (
    <Layout title={"Authorize your Fitbit"} description={""}>
        <h1 className="project-text">Authorize your Fitbit</h1>
        <div>
        <Link href={fitbitSignInLink}>
              <Button 
                className="project-button"
                variant="contained" 
                color={GeneralUtility.doesFitbitInfoExist(userInfo)? "success":"primary"}>
                Authorize your Fitbit
              </Button>
            </Link>
          <br />
          <br />

          <p>Please do not change your Fitbit device or account during the study.</p>
        </div>
    </Layout>
  );
}


/*
<Button variant="contained" style={{ width: "100%" }} onClick={onSaveClick} >Save</Button>
*/