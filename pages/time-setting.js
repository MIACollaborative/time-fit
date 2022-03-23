import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import "primereact/resources/themes/nova/theme.css"
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';


import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
/*
import logger from "../lib/logger";

*/

import { inspect } from 'util';

import Link from 'next/link';
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import md5 from "md5";
import FitbitHelper from '../lib/FitbitHelper';


import prisma from '../lib/prisma.js';
import { ConnectedOverlayScrollHandler } from 'primereact/utils';

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

  if(!session){
    return {
      props: {},
    };
  }

  let userName = session.user.name;

  
  const user = await prisma.users.findFirst({
    where: { username: userName },
  });

  console.log(
    `main.getServerSideProps: user: ${JSON.stringify(user)}`
  );
  


  console.log(`name: ${userName} - fitbiId: ${user.fitbitId}`);
  let hasFitbitConnection = user.fitbitId != undefined && user.accessToken != undefined && user.refreshToken != undefined;


  let isAccessTokenActive = false;

  
  const introspectResult = await FitbitHelper.introspectToken(user.accessToken)
    .then((responseData) => {
      console.log(`main.FitbitHelper.introspectToken: ${JSON.stringify(responseData)}`);
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
        console.log('Error', error.message);

        console.log("Error else");
      }
      //res.status(error.response.status).json({ response: inspect(error.response.data) });

      
      return {value: "failed", data: resultObj};
    });


    console.log(
      `main.getServerSideProps: introspectResult: ${JSON.stringify(introspectResult)}`
    );

  //isAccessTokenActive = introspectResult.active;
  
  return {
    props: { userInfo: user, hasFitbitConnection, isAccessTokenActive, introspectResult },
  };
}


export default function TimeSetting({ userInfo, hasFitbitConnection, isAccessTokenActive, introspectResult }) {

  const { data: session, status } = useSession();
  const router = useRouter();

  const [weekdayWakeup, setWeekdayWakeup] = useState(userInfo.weekdayWakeup != undefined? userInfo.weekdayWakeup: "");
  const [weekdayBed, setWeekdayBed] = useState(userInfo.weekdayBed != undefined? userInfo.weekdayBed: "");

  const [weekendWakeup, setWeekendWakeup] = useState(userInfo.weekendWakeup != undefined? userInfo.weekendWakeup: "");
  const [weekendBed, setWeekendBed] = useState(userInfo.weekendBed != undefined? userInfo.weekendBed: "");

  //logger.logToDB("main", {message: "test"});

  //const [value1, setValue1] = useState('');
  //const [value2, setValue2] = useState('');



  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push('/');
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

  let fitbitSignInLink = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23829X&redirect_uri=${encodeURIComponent(redirectURL)}&state=${state}&scope=${scope}&expires_in=604800`;


  async function updateTimePreference(dayWake, dayBed, endWake, endBed) {
    console.log(`updateTimePreference, dayWake: ${dayWake}`);
    console.log(`updateTimePreference, dayBed: ${dayBed}`);
    console.log(`updateTimePreference, endWake: ${endWake}`);
    console.log(`updateTimePreference, endBed: ${endBed}`);

    const updateUser = await prisma.users.update({
        where: { username: userInfo.username },
        data: {
          weekdayWakeup: accessToken,
          weekdayBed: dayBed,
          weekendWakeup: endWake,
          weekendBed: endBed
        },
    });

    console.log(`updateTimePreference: ${JSON.stringify(updateUser)}`);
  }

  function onSaveClick(event){
    updateTimePreference(weekdayWakeup, weekdayBed, weekendWakeup, weekendBed);
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Wawking Hours</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>


        <div>
            <div>On weekdays, when do you typically wakeup?</div><br />
            <TimePicker
              label="Weekday Wake Up Time"
              value={weekdayWakeup}
              onChange={(newValue) => {
                setWeekdayWakeup(newValue);
                console.log(`setWeekdayWakeup: ${newValue}`);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Divider />
            <div>On weekdays, when do you typically go to bed?</div><br />
            <TimePicker
              label="Weekday Bed Time"
              value={weekdayBed}
              onChange={(newValue) => {
                setWeekdayBed(newValue);
                console.log(`setWeekdayBed: ${newValue}`);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Divider />
            <div>On weekends, when do you typically wakeup?</div><br />
            <TimePicker
              label="Weekend Wake Up Time"
              value={weekendWakeup}
              onChange={(newValue) => {
                setWeekendWakeup(newValue);
                console.log(`setWeekendWakeup: ${newValue}`);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Divider />
            <div>On weekends, when do you typically go to bed?</div><br />
            <TimePicker
              label="Weekend Bed Time"
              value={weekendBed}
              onChange={(newValue) => {
                setWeekendBed(newValue);
                console.log(`setWeekendBed: ${newValue}`);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Divider />
            <Button label="Save" onClick={onSaveClick} className="p-button-info" style={{ width: "100%" }} />
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
