import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../component/Layout";

import TextField from "@mui/material/TextField";
/*
import logger from "../lib/logger";

*/

import { inspect } from "util";

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
  console.log(`set-walk-auto-to-10.getServerSideProps: session: ${JSON.stringify(session)}`);

  if (!session) {
    return {
      props: {},
    };
  }

  let userName = session.user.name;

  const uniqueUser = await prisma.users.findFirst({
    where: { username: userName },
  });

  console.log(`main.getServerSideProps: user: ${JSON.stringify(uniqueUser)}`);

  const userInfo = JSON.parse(JSON.stringify(uniqueUser, replacer));

  return {
    props: { userInfo },
  };
}

export default function SetWalkAutoTo10({ userInfo }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  /*
  const [preferredName, setPreferredName] = useState(
    userInfo.preferredName != undefined ? userInfo.preferredName : ""
  );
  const [phone, setPhone] = useState(
    userInfo.phone != undefined ? userInfo.phone : ""
  );
  */

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);

  async function updateInfo(
    username,
    info
  ) {
    console.log(`SetWalkAutoTo10.updateInfo: ${username}`);
    console.log(`SetWalkAutoTo10.updateInfo.info: ${JSON.stringify(info)}`);

    const result = await fetch(
      "/api/user?function_name=update_info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...info, 
          username: username
        }),
      }
    ).then((r) => {
      return r.json();
    });

    return result;
  }

  function onSaveClick(event) {
    let preparationInfo = undefined;
    console.log(`onSaveClick: userInfo.autoWalkTo10 ${userInfo.autoWalkTo10}`);
    preparationInfo = {
      autoWalkTo10: true
    }

    console.log(`onSaveClick: updatedInfo preparation ${JSON.stringify(preparationInfo, null, 2)}`);

    updateInfo(
      userInfo.username,
      preparationInfo
    ).then((response) => {
      router.push("/main");
      return response;
    });
  }

  return (
    <Layout title={"Set Walk Auto-recognition to 10"} description={""}>


        <h1 className="project-text">Set Auto-recognized Walk to 10 minute</h1>
        <img src='/image/svg/autorecognized-walk-to-10min.svg' alt="Reminder"/>


        <br />
        <br />
        <Button 
        
          variant="contained"
          className="project-button"
          onClick={(event) => {
            onSaveClick(event);
            return;
          }}
        >
          10 minute walk is set
        </Button>
        <br />
        <br />
        <Button variant="contained" style={{ width: "100%", display: "none" }}

          onClick={(event) => {
            router.push("/main");
            return;
          }}
        
        >
          Cancel
        </Button>
      
    </Layout>
  );
}

/*
<div style="width: 100%; display: block;">
<Image src={'/image/svg/turn-off-fitbit-reminders.svg'} alt="Reminder note" layout="responsive" />
</div>
*/

/*
<div style="display:none;">
<div>1. Open your Fitbit app on your phone.</div>
<div>2. Open the Today tab, (icon) tap the hourly activity tile.</div>
<div>3. Tap the gear icon, (icon) turn Reminders to move off.</div>
</div>
*/