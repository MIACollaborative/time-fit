import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../component/Layout";

import TextField from "@mui/material/TextField";

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
  console.log(`turn-off-fitbit-reminder.getServerSideProps: session: ${JSON.stringify(session)}`);

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

export default function TurnOffFitbitReminder({ userInfo }) {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    console.log(`TurnOffFitbitReminder.updateInfo: ${username}`);
    console.log(`TurnOffFitbitReminder.updateInfo.info: ${JSON.stringify(info)}`);

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
    console.log(`onSaveClick: userInfo.fitbitReminderTurnOff ${userInfo.fitbitReminderTurnOff}`);
    preparationInfo = {
      fitbitReminderTurnOff: true
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
    <Layout title={"Turn Off Fitbit Reminder"} description={""}>


        <h1 className="project-text">Turn off Fitbit reminders to move</h1>
        <img src='/image/svg/turn-off-fitbit-reminders.svg' alt="Reminder"/>


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
          Reminder is turned off
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
