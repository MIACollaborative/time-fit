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
  let startDate = nowDate.minus({weeks: 1}).startOf("day");
  let sevenDaysConstraint = {
    gte: startDate.toISO(),
    lte: nowDate.toISO()
  };
  /*
  createdAt: {
    gte: startDate.toISO(),
    lte: endDate.toISO()
  }
  */

  /*
  console.log(`dashboard.getServerSideProps: find userList`);
  if (adminUsernameList.includes(userName)) {
    userList = await prisma.users.findMany({
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
      //take: queryLimit
    });

    userInfoList = JSON.parse(JSON.stringify(userList, replacer));
  }
  */

  console.log(`dashboard.getServerSideProps: find responseList`);
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
      //take: queryLimit
    });

    responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));
  }

  console.log(`dashboard.getServerSideProps: find fitbitSubscriptionList`);
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
      //take: queryLimit
    });

    fitbitSubscriptionInfoList = JSON.parse(JSON.stringify(fitbitSubscriptionList, replacer));
  }


  console.log(`dashboard.getServerSideProps: find fitbitNotificationList`);
  if (adminUsernameList.includes(userName)) {
    // v2: try filter
    fitbitNotificationList = await prisma.fitbit_update.findMany({
      where:{
        createdAt: sevenDaysConstraint
      },
      orderBy: [
        {
          //date: "desc",
          createdAt: "desc",
        },
      ],
      //take: queryLimit * 2
    });
    //fitbitNotificationList = GeneralUtility.removeFitbitUpdateDuplicate(fitbitNotificationList, true).slice(0, queryLimit);


    // v1: typical
    /*
    fitbitNotificationList = await prisma.fitbit_update.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      take: queryLimit * 2
    });
    */

    fitbitNotificationInfoList = JSON.parse(JSON.stringify(fitbitNotificationList, replacer));
  }

  console.log(`dashboard.getServerSideProps: find fitbitDataList`);
  if (adminUsernameList.includes(userName)) {
    fitbitDataList = await prisma.fitbit_data.findMany({
      where:{
        createdAt: sevenDaysConstraint
      },
      include: {
        owner: true,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      //take: queryLimit
    });

    fitbitDataInfoList = JSON.parse(JSON.stringify(fitbitDataList, replacer));
  }

  console.log(`dashboard.getServerSideProps: find updateDiffList`);
  if (adminUsernameList.includes(userName)) {
    updateDiffList = await prisma.update_diff.findMany({
      where:{
        createdAt: sevenDaysConstraint
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      //take: queryLimit
    });

    updateDiffInfoList = JSON.parse(JSON.stringify(updateDiffList, replacer));
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

  /*
  console.log(`dashboard.getServerSideProps: find taskLogList`);
  if (adminUsernameList.includes(userName)) {
    taskLogList = await prisma.taskLog.findMany({
      where:{
        createdAt: sevenDaysConstraint
      },

      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      //take: queryLimit
    });

    taskLogInfoList = JSON.parse(JSON.stringify(taskLogList, replacer));
  }
  */

  console.log(`dashboard.getServerSideProps: find taskLogInvestigatorList`);
  if (adminUsernameList.includes(userName)) {
    taskLogInvestigatorList = await prisma.taskLog.findMany({
      where: {
        taskLabel: { contains: "investigator" },
        createdAt: sevenDaysConstraint
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

  console.log(`dashboard.getServerSideProps: find taskLogGroupByInfoList`);
  // wil enable once I test the groupby feature

  if (adminUsernameList.includes(userName)) {
    // temporary disable 
    taskLogGroupByInfoList = [];
    /*
    taskLogGroupByList = await prisma.taskLog.groupBy({
      by: ["username", "messageLabel"],
      _count: {
        messageLabel: true,
      },
      orderBy: [
        {
          username: "asc",
        },
      ],
      //take: queryLimit
    });
    taskLogGroupByInfoList = JSON.parse(JSON.stringify(taskLogGroupByList, replacer));
    */
  }


  /*
  console.log(`dashboard.getServerSideProps: find messageList`);
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
  */

  let assetHostURL = `${process.env.ASSET_HOST_URL}`;

  // userInfoList,  taskLogInfoList,messageInfoList, 
  return {
    props: { responseInfoList, fitbitSubscriptionInfoList, fitbitNotificationInfoList, fitbitDataInfoList, updateDiffInfoList, taskInfoList,  taskLogGroupByInfoList, taskLogInvestigatorInfoList, userInfo, assetHostURL },
  };
}

//  userInfoList, taskLogInfoList,messageInfoList, 
export default function Dashboard({ responseInfoList, fitbitSubscriptionInfoList, fitbitNotificationInfoList, fitbitDataInfoList, updateDiffInfoList, taskInfoList, taskLogGroupByInfoList, taskLogInvestigatorInfoList, userInfo, assetHostURL }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tabName, setTabName] = useState("Users");


  // userInfoList
  const [userInfoList, setUserInfoList] = useState([]);

  // messageInfoList
  const [messageInfoList, setMessageInfoList] = useState([]);
  // taskLogInfoList
  const [taskLogInfoList, setTaskLogInfoList] = useState([]);


  const handleTabChange = (event, newTabName) => {
    setTabName(newTabName);
  };

  /*
  async function queryTaskLogs(functionName, startDate, endDate) {
    const result = await fetch(`/api/task-log?function_name=${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: 0,
        startDate: DateTime.fromJSDate(startDate).toISO(),
        endDate: DateTime.fromJSDate(endDate).toISO()
      }),
    }).then((r) => {
      return r.json();
    });
    return result;
  }
  */


    
    let nowDate = DateTime.now();
    let startDate = nowDate.minus({weeks: 1}).startOf("day");

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

    useEffect(() => {
      //queryTaskLogs("get",startDate.toJSDate(), nowDate.toJSDate() )
      fetch('/api/task-log?function_name=get', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 0,
          startDate: startDate.toISO(),
          endDate: nowDate.toISO()
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(`setTaskLogInfoList: length: ${data.result.length}`);
          setTaskLogInfoList(data.result)
        })
    }, []);

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;

  if (!session) {
    router.push("/");
    return null;
  }

    // Function for getting taskLog

    



  console.log(`session: ${JSON.stringify(session)}`);

  //console.log(`userInfoList: ${JSON.stringify(userInfoList)}`);

  //console.log(`fitbitDataInfoList: ${JSON.stringify(fitbitDataInfoList)}`);

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
          value="Task Log By User"
          aria-label="centered"
        >
          Task Log By User
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
        <UserTable infoList={userInfoList} userInfo={userInfo} />
      ) : null}

      {tabName == "Survey Response" ? (
        <SurveyResponseTable infoList={responseInfoList} userInfo={userInfo} />
      ) : null}

      {tabName == "Fitbit Subscription" ? (
        <FitbitSubscriptionTable infoList={fitbitSubscriptionInfoList} />
      ) : null}

      {tabName == "Fitbit Notification" ? (
        <FitbitNotificationTable infoList={fitbitNotificationInfoList}  userInfo={userInfo}/>
      ) : null}
      {tabName == "Fitbit Data" ? (
        <FitbitDataTable infoList={fitbitDataInfoList}  userInfo={userInfo}/>
      ) : null}

      {tabName == "Update Diff" ? (
        <UpdateDiffTable infoList={updateDiffInfoList}  userInfo={userInfo}/>
      ) : null}

      {tabName == "Task" ? (
        <TaskTable infoList={taskInfoList} />
      ) : null}

      {tabName == "Investigator Task Log" ? (
        <TaskLogTable infoList={taskLogInvestigatorInfoList} userInfo={userInfo} />
      ) : null}

      {tabName == "Task Log By User" ? (
        <TaskLogGroupByTable infoList={taskLogGroupByInfoList} />
      ) : null}

      {tabName == "Task Log" ? (
        <TaskLogTable infoList={taskLogInfoList} userInfo={userInfo} />
      ) : null}

      {tabName == "Message" ? (
        <MessageTable infoList={messageInfoList} userInfo={userInfo} assetHostURL={assetHostURL} />
      ) : null}
    </Layout>
  );
}
