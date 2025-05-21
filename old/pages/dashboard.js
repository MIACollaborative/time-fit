import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from '../component/Layout';
import { Button } from "@mui/material";
import { inspect } from "util";
import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import GeneralUtility from "../lib/GeneralUtility.mjs";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import prisma from "../lib/prisma.mjs";

import SurveyResponseTable from "../component/SurveyResponseTable";
import FitbitNotificationTable from "../component/FitbitNotificationTable";
import TaskTable from "../component/TaskTable";
import TaskLogTable from "../component/TaskLogTable";
import MessageTable from "../component/MessageTable";
import FitbitSubscriptionTable from "../component/FitbitSubscriptionTable";
import FitbitDataTable from "../component/FitbitDataTable";
import UserTable from "../component/UserTable";
import TaskLogGroupByTable from "../component/TaskLogGroupByTable";
import UpdateDiffTable from "../component/UpdateDiffTable";

import { DateTime } from "luxon";

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

const adminUsernameList = ["test1", "test2", "test3", "test4"];

let notRenderingList = ["Fitbit Notification", "Fitbit Data", "Update Diff", "Task Log By User", "Task Log"];

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log(`dashboard.getServerSideProps: session: ${JSON.stringify(session)}`);

  if (!session) {
    return {
      props: {},
    };
  }

  let userName = session.user.name;


  console.log(`dashboard.getServerSideProps: find user`);
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

  let updateDiffList = [];
  let updateDiffInfoList = [];

  let taskList = [];
  let taskInfoList = [];

  let taskLogList = [];
  let taskLogInfoList = [];

  let taskLogGroupByList = [];
  let taskLogGroupByInfoList = [];

  let taskLogInvestigatorList = [];
  let taskLogInvestigatorInfoList = [];

  let messageList = [];
  let messageInfoList = [];

  let queryLimit = 150;


  let nowDate = DateTime.now();
  let startDate = nowDate.minus({ weeks: 1 }).startOf("day");
  let sevenDaysConstraint = {
    gte: startDate.toISO(),
    lte: nowDate.toISO()
  };

  let forteenDaysConstraint = {
    gte: nowDate.minus({ weeks: 2 }).startOf("day").toISO(),
    lte: nowDate.toISO()
  };

  console.log(`dashboard.getServerSideProps: find fitbitSubscriptionList`);
  if (adminUsernameList.includes(userName)) {
    fitbitSubscriptionList = await prisma.fitbit_subscription.findMany({
      /*
      include: {
        owner: true,
      },
      */
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      //take: queryLimit
    });
    if (fitbitSubscriptionList) {
      // Process the retrieved subscriptions
      fitbitSubscriptionInfoList = JSON.parse(JSON.stringify(fitbitSubscriptionList, replacer));
    } else {
      // Handle the case when no subscriptions are found
      // ...
    }
  }

  console.log(`dashboard.getServerSideProps: find taskList`);
  if (adminUsernameList.includes(userName)) {
    taskList = await prisma.task.findMany({
      /*
      where: {
        NOT: {
          taskLabel: {contains: "investigator"}
        },
      },
      */
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
      //take: queryLimit
    });

    taskInfoList = JSON.parse(JSON.stringify(taskList, replacer));
  }

  let assetHostURL = `${process.env.ASSET_HOST_URL}`;

  // userInfoList,  taskLogInfoList,messageInfoList, responseInfoList, taskLogGroupByInfoList, updateDiffInfoList,fitbitDataInfoList,taskLogInvestigatorInfoList, fitbitNotificationInfoList,
  return {
    props: { fitbitSubscriptionInfoList,  taskInfoList,  userInfo, assetHostURL },
  };
}

//  userInfoList, taskLogInfoList,messageInfoList, responseInfoList, taskLogGroupByInfoList, updateDiffInfoList,  fitbitDataInfoList, taskLogInvestigatorInfoList,fitbitNotificationInfoList, 

export default function Dashboard({ fitbitSubscriptionInfoList, taskInfoList,  userInfo, assetHostURL }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tabName, setTabName] = useState("Users");


  // userInfoList
  const [userInfoList, setUserInfoList] = useState([]);

  // fitbitDataInfoList
  const [fitbitDataInfoList, setFitbitDataInfoList] = useState([]);

  // fitbitNotificationInfoList
  const [fitbitNotificationInfoList, setFitbitNotificationInfoList] = useState([]);

  // responseInfoList
  const [responseInfoList, setResponseInfoList] = useState([]);

  // updateDiff
  const [updateDiffInfoList, setUpdateDiffInfoList] = useState([]);

  // messageInfoList
  const [messageInfoList, setMessageInfoList] = useState([]);

  // taskLogInfoList
  const [taskLogInfoList, setTaskLogInfoList] = useState([]);

  // taskLogInvestigatorInfoList
  const [taskLogInvestigatorInfoList, setTaskLogInvestigatorInfoList] = useState([]);

  const handleTabChange = (event, newTabName) => {
    setTabName(newTabName);
  };


  let nowDate = DateTime.now();
  let startDate = nowDate.minus({ weeks: 1 }).startOf("day");

  // userInfoList
  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/user?function_name=get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setUserInfoList: length: ${data.result.length}`);
        setUserInfoList(data.result)
      })
  }, []);

  // messageInfoList
  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/message?function_name=get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setMessageInfoList: length: ${data.result.length}`);
        setMessageInfoList(data.result)
      })
  }, []);

  // responseInfoList
  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/response?function_name=get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setResponseInfoList: length: ${data.result.length}`);
        setResponseInfoList(data.result)
      })
  }, []);

    // fitbitDataInfoList
    useEffect(() => {
      //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
      fetch('/api/fitbit-data?function_name=get', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: nowDate.minus({ days: 7 }).startOf("day"), // startDate.toISO(),
          endDate: nowDate.toISO()
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(`setFitbitDataInfoList: length: ${data.result.length}`);
          setFitbitDataInfoList(data.result)
        })
    }, []);

        // fitbitNotificationInfoList
        useEffect(() => {
          //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
          fetch('/api/fitbit-update?function_name=get', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startDate: nowDate.minus({ days: 7 }).startOf("day"), // startDate.toISO(),
              endDate: nowDate.toISO()
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(`setFitbitNotificationInfoList: length: ${data.result.length}`);
              setFitbitNotificationInfoList(data.result)
            })
        }, []);

  // updateDiffInfoList
  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/update-diff?function_name=get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({             
        startDate: nowDate.minus({ days: 7 }).startOf("day"), // startDate.toISO(),
      endDate: nowDate.toISO()}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setUpdateDiffInfoList: length: ${data.result.length}`);
        setUpdateDiffInfoList(data.result)
      })
  }, []);

  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/task-log?function_name=get', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: 0,
        startDate: nowDate.minus({ days: 7 }).startOf("day"), // startDate.toISO(),
        endDate: nowDate.toISO()
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setTaskLogInfoList: length: ${data.result.length}`);
        setTaskLogInfoList(data.result)
      })
  }, []);


  // investigator
  useEffect(() => {
    //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
    fetch('/api/task-log?function_name=get_investigator', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: 0,
        startDate: nowDate.minus({ days: 7 }).startOf("day"), // startDate.toISO(),
        endDate: nowDate.toISO()
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`setTaskLogInvestigatorInfoList: length: ${data.result.length}`);
        setTaskLogInvestigatorInfoList(data.result)
      })
  }, []);

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

  console.log(`session: ${JSON.stringify(session)}`);

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
          value="Update Diff"
          aria-label="centered"
        >
          Update Diff
        </ToggleButton>
        <ToggleButton
          value="Task"
          aria-label="centered"
        >
          Task
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
        <UserTable infoList={userInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Survey Response" ? (
        <SurveyResponseTable infoList={responseInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Fitbit Subscription" ? (
        <FitbitSubscriptionTable infoList={fitbitSubscriptionInfoList} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Fitbit Notification" ? (
        <FitbitNotificationTable infoList={fitbitNotificationInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}
      {tabName == "Fitbit Data" ? (
        <FitbitDataTable infoList={fitbitDataInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Update Diff" ? (
        <UpdateDiffTable infoList={updateDiffInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Task" ? (
        <TaskTable infoList={taskInfoList} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Investigator Task Log" ? (
        <TaskLogTable infoList={taskLogInvestigatorInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}



      {tabName == "Task Log" ? (
        <TaskLogTable infoList={taskLogInfoList} userInfo={userInfo} renderData={!notRenderingList.includes(tabName)} />
      ) : null}

      {tabName == "Message" ? (
        <MessageTable infoList={messageInfoList} userInfo={userInfo} assetHostURL={assetHostURL} renderData={!notRenderingList.includes(tabName)} />
      ) : null}
    </Layout>
  );
}
