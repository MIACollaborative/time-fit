import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import prisma from '../lib/prisma';



import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import Button from '@mui/material/Button';
import FitbitHelper from "../lib/FitbitHelper.mjs";
import { inspect } from 'util';
import GeneralUtility from "../lib/GeneralUtility.mjs";
import DatabaseUtility from "../lib/DatabaseUtility.mjs";
const { DateTime } = require("luxon");

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);

  const user = await prisma.users.findFirst({
    where: { username: session.user.name },
  });


  const subscriptionList = await DatabaseUtility.listSubscriptionsForUser(user, ["activities", "userRevokedAccess"]);

  return {
    props: { subscriptionList: subscriptionList},
  };
}

export default function DisplaySubscription({subscriptionList}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "loading") return <div>loading...</div>;
  if (!session){
    router.push('/');
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);



  return (
    <div className={styles.container}>
      <Head>
        <title>Walk To Joy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <h1 className={styles.title}>Display subscription for {session.user.name}</h1>
        <div>
            {
                JSON.stringify(subscriptionList, null, 2)
            }
        </div>
        <br />
        <br />

        <Button variant="contained" onClick={(event) => {
            router.push("/main");
            return;
          }} >Return to settings</Button>

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