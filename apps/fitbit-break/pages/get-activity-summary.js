import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React from "react";
import Button from "@mui/material/Button";
import { DateTime } from "luxon";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

import UserInfoHelper from "@time-fit/helper/UserInfoHelper";
import FitbitDataHelper from "@time-fit/data-source/fitbit/helper/FitbitDataHelper";

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      props: {},
    };
  }

  const user = await UserInfoHelper.getUserInfoByUsername(session.user.name);

  const targetDate = DateTime.fromISO("2022-03-10");

  const activityResult =
    await FitbitDataHelper.queryAndStoreFitbitActivitySummaryAtTargetDateForUser(
      user,
      targetDate,
      false,
      1,
      false
    );

  return {
    props: { result: activityResult, dateString: targetDate.toISO() },
  };
}

export default function GetActivitySummary({ result, dateString }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "loading") return <div>loading...</div>;
  if (!session) {
    router.push("/");
    return null;
  }

  let message = "";

  const briefDateString = dateString;

  if (result.value == "failed") {
    message = `Fail to get activity summary for ${briefDateString}!\n`;
  } else {
    message = `Succeed to get activity summary ${briefDateString}!\n`;
  }

  const resultData = result.data;

  let hasAuthorizationError = false;

  if (
    result.value == "failed" &&
    resultData.errors[0].message.includes("Authorization Error")
  ) {
    hasAuthorizationError = true;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Fitbit Break</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{message}</h1>
        <div>
          {result.value == "success" ? (
            <h2>Steps: {resultData.summary.steps}</h2>
          ) : null}
        </div>
        <div>{JSON.stringify(result.data)}</div>
        <div>
          {result.value == "failed"
            ? `Error: ${resultData.errors[0]["errorType"]}`
            : null}
        </div>
        <div>
          {result.value == "failed" &&
          resultData.errors[0]["errorType"] == "expired_token" ? (
            <Button
              variant="contained"
              onClick={(event) => {
                router.push("/refresh-token");
                return;
              }}
            >
              Refresh token
            </Button>
          ) : null}
        </div>
        <br />
        <br />
        <div>
          {result.value == "failed" &&
          resultData.errors[0]["errorType"] == "invalid_token" ? (
            <div>Please connect your Fitbit in Settings.</div>
          ) : null}
        </div>
        <br />
        <br />

        <Button
          variant="contained"
          onClick={(event) => {
            router.push("/main");
            return;
          }}
        >
          Return to home
        </Button>
      </main>

      <footer className={styles.main}>
        <div>Fitbit Break</div>
      </footer>
    </div>
  );
}
