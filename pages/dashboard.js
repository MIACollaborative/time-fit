import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from '../component/Layout';
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import prisma from "../lib/prisma.mjs";

import SurveyResponseTable from "../component/SurveyResponseTable";
import FitbitNotificationTable from "../component/FitbitNotificationTable";
import TaskLogTable from "../component/TaskLogTable";
import MessageTable from "../component/MessageTable";
import FitbitSubscriptionTable from "../component/FitbitSubscriptionTable";
import FitbitDataTable from "../component/FitbitDataTable";
import UserTable from "../component/UserTable";

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

const adminUsernameList = ["test1", "test2", "test3", "test4"];

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log(`main.getServerSideProps: session: ${JSON.stringify(session)}`);

  if (!session) {
    return {
      props: {},
    };
  }

  let userName = session.user.name;


  const aUser = await prisma.users.findFirst({
    where: { username: userName },
  });

  let userInfo = JSON.parse(JSON.stringify(aUser, replacer));

  let userList = [];
  let userInfoList = [];

  let responseList = [];
  let responseInfoList = [];
  
  let fitbitSubscriptionList = [];
  let fitbitSubscriptionInfoList = [];

  let fitbitNotificationList = [];
  let fitbitNotificationInfoList = [];

  let fitbitDataList = [];
  let fitbitDataInfoList = [];

  let taskLogList = [];
  let taskLogInfoList = [];

  let taskLogInvestigatorList = [];
  let taskLogInvestigatorInfoList = [];

  let messageList = [];
  let messageInfoList = [];

  let queryLimit = 150;

  if (adminUsernameList.includes(userName)) {
    userList = await prisma.users.findMany({
      orderBy: [
        {
          username: "asc",
        },
      ],
      //take: queryLimit
    });

    userInfoList = JSON.parse(JSON.stringify(userList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    responseList = await prisma.response.findMany({
      /*
        select:{
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        },
        */
      orderBy: [
        {
          updatedAt: "desc",
        },
        
      ],
      take: queryLimit
    });

    responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    fitbitSubscriptionList = await prisma.fitbit_subscription.findMany({
      include: {
        owner: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: queryLimit
    });

    fitbitSubscriptionInfoList = JSON.parse(JSON.stringify(fitbitSubscriptionList, replacer));
  }


  if (adminUsernameList.includes(userName)) {
    fitbitNotificationList = await prisma.fitbit_update.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: queryLimit
    });

    fitbitNotificationInfoList = JSON.parse(JSON.stringify(fitbitNotificationList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    fitbitDataList = await prisma.fitbit_data.findMany({
      include: {
        owner: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: queryLimit
    });

    fitbitDataInfoList = JSON.parse(JSON.stringify(fitbitDataList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    taskLogList = await prisma.taskLog.findMany({
      /*
      where: {
        NOT: {
          taskLabel: {contains: "investigator"}
        },
      },
      */
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: queryLimit
    });

    taskLogInfoList = JSON.parse(JSON.stringify(taskLogList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    taskLogInvestigatorList = await prisma.taskLog.findMany({
      where:{
        taskLabel: {contains: "investigator"}
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      //take: queryLimit
    });

    taskLogInvestigatorInfoList = JSON.parse(JSON.stringify(taskLogInvestigatorList, replacer));
  }

  if (adminUsernameList.includes(userName)) {
    messageList = await prisma.message.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ]
    });

    messageInfoList = JSON.parse(JSON.stringify(messageList, replacer));
  }

  let hostURL = `${process.env.NEXTAUTH_URL}`;

  return {
    props: { userInfoList, responseInfoList, fitbitSubscriptionInfoList, fitbitNotificationInfoList, fitbitDataInfoList, taskLogInfoList, taskLogInvestigatorInfoList,  messageInfoList, userInfo, hostURL},
  };
}

export default function Dashboard({ userInfoList, responseInfoList, fitbitSubscriptionInfoList, fitbitNotificationInfoList, fitbitDataInfoList, taskLogInfoList, taskLogInvestigatorInfoList, messageInfoList, userInfo, hostURL}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tabName, setTabName] = useState("Users");

  const handleTabChange = (event, newTabName) => {
    setTabName(newTabName);
  };

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

  console.log(`userInfoList: ${JSON.stringify(userInfoList)}`);

  console.log(`fitbitDataInfoList: ${JSON.stringify(fitbitDataInfoList)}`);

  return (
    <Layout title={"Walk To Joy"} description={""}>
      <ToggleButtonGroup
        value={tabName}
        exclusive
        onChange={handleTabChange}
        aria-label="tab name"
      >
        <ToggleButton value="Users" aria-label="left aligned">
          Users
        </ToggleButton>
        <ToggleButton value="Survey Response" aria-label="left aligned">
          Survey Response
        </ToggleButton>
        <ToggleButton
          value="Fitbit Subscription"
          aria-label="centered"
        >
          Fitbit Subscription
        </ToggleButton>
        <ToggleButton
          value="Fitbit Notification"
          aria-label="centered"
        >
          Fitbit Notification
        </ToggleButton>
        <ToggleButton
          value="Fitbit Data"
          aria-label="centered"
        >
          Fitbit Data
        </ToggleButton>
        <ToggleButton
          value="Investigator Task Log"
          aria-label="centered"
        >
          Investigator Task Log
        </ToggleButton>
        <ToggleButton
          value="Task Log"
          aria-label="centered"
        >
          All Task Log
        </ToggleButton>
        <ToggleButton
          value="Message"
          aria-label="centered"
        >
          Message
        </ToggleButton>
      </ToggleButtonGroup>

      {tabName == "Users" ? (
        <UserTable infoList={userInfoList} />
      ) : null}

      {tabName == "Survey Response" ? (
        <SurveyResponseTable infoList={responseInfoList} />
      ) : null}

      {tabName == "Fitbit Subscription" ? (
        <FitbitSubscriptionTable infoList={fitbitSubscriptionInfoList} />
      ) : null}
      
      {tabName == "Fitbit Notification" ? (
        <FitbitNotificationTable infoList={fitbitNotificationInfoList} />
      ) : null}
      {tabName == "Fitbit Data" ? (
        <FitbitDataTable infoList={fitbitDataInfoList} />
      ) : null}

      {tabName == "Investigator Task Log" ? (
        <TaskLogTable infoList={taskLogInvestigatorInfoList} />
      ) : null}

      {tabName == "Task Log" ? (
        <TaskLogTable infoList={taskLogInfoList} />
      ) : null}

      {tabName == "Message" ? (
        <MessageTable infoList={messageInfoList} userInfo={userInfo} hostURL={hostURL} />
      ) : null}
    </Layout>
  );
}
