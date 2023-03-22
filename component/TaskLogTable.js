
/*
import logger from "../lib/logger";

*/

import React, { Fragment, useState } from 'react';
import { Button } from '@mui/material';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import GeneralUtility from '../lib/GeneralUtility.mjs';
import { DateTime } from "luxon";
import ObjectListExortToolbar from './ObjectListExortToolbar.js';
function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function TaskLogTable({ infoList, userInfo }) {

  const [filterTaskLabel, setFilterTaskLabel] = useState("");
  const [filterTaskUser, setFilterTaskUser] = useState("");

  /*
  id  String  @id @default(auto()) @map("_id") @db.ObjectId

  // for task
  task    task    @relation(fields: [taskLabel], references: [label])
  taskLabel String

  // for user
  user    users    @relation(fields: [username], references: [username])
  username String

  // caching user info
  userInfoCache Json?

  // for action
  randomizationResult Json

  // for message, possibly none if no action or action that does not invovle message
  message    message?    @relation(fields: [messageLabel], references: [label])
  messageLabel String?

  
  // for execution
  executionResult Json?
  
  // for time
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt
  */



  // row.executionResult.value != undefined && ()


  let filteredInfoList = infoList;

  if (filterTaskLabel != "") {
    filteredInfoList = filteredInfoList.filter((info) => {
      return info.taskLabel == filterTaskLabel;
    });
  }

  if (filterTaskUser != "") {
    filteredInfoList = filteredInfoList.filter((info) => {
      return info.username == filterTaskUser;
    });
  }


  return (
    <Fragment>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item><ObjectListExortToolbar filePrefix={"TaskLog"} infoList={infoList} userInfo={userInfo}></ObjectListExortToolbar></Item>
        </Grid>
        <Grid item xs={2}>
          <Item><TextField
            //fullWidth
            label="Filter task label"
            //id="fullWidth"
            value={filterTaskLabel}
            onChange={(event) => {
              console.log(`setFilterTaskLabel: ${event.currentTarget.value}`);
              setFilterTaskLabel(event.currentTarget.value);

            }}
          /></Item>
        </Grid>
        <Grid item xs={2}>
          <Item> <TextField
            //fullWidth
            label="Filter task username"
            //id="fullWidth"
            value={filterTaskUser}
            onChange={(event) => {
              console.log(`setFilterTaskUser: ${event.currentTarget.value}`);
              setFilterTaskUser(event.currentTarget.value);

            }}
          /></Item>
        </Grid>
      </Grid>


      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Task Label</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">isActivated</TableCell>
              <TableCell align="right">Activation Reasoning</TableCell>
              <TableCell align="right">Randomization</TableCell>
              <TableCell align="right">Action</TableCell>
              <TableCell align="right">Execution Result</TableCell>

              <TableCell align="right">Created At (your time)</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Updated At</TableCell>
              <TableCell align="right">PreCondition Result</TableCell>
              <TableCell align="right">User Info Cache</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInfoList.map((row, index) => {

              let highlightExecutionResult = false;

              if (row.executionResult.value == undefined) {
                // this is the old one, likely for noAction
                ;
              }
              else {
                if (row.executionResult.value.errorMessage == null || row.executionResult.value.errorMessage == "") {
                  ;
                }
                else {
                  highlightExecutionResult = true;
                }
              }


              return <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.taskLabel}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.isActivated}</TableCell>
                <TableCell align="right">{JSON.stringify(row.activationReasoning)}</TableCell>
                <TableCell align="right">{GeneralUtility.convertRandomizationResultToString(row.randomizationResult)}</TableCell>
                <TableCell align="right">{GeneralUtility.extractOutcomeToString(row.randomizationResult.theChoice)}</TableCell>
                <TableCell align="right" style={highlightExecutionResult ? { background: "lightcoral" } : {}}>{GeneralUtility.convertExecutionResultToString(row.executionResult)}</TableCell>
                <TableCell align="right">{DateTime.fromISO(row.createdAt).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                <TableCell align="right">{row.updatedAt}</TableCell>
                <TableCell align="right">{JSON.stringify(row.preConditionResult)}</TableCell>
                <TableCell align="right">{GeneralUtility.extractUserKeyAttributesToString(row.userInfoCache)}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>

  )
}


// extra

/*
const adminUsernameList = [
  "test1",
  "test2"
];


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

  
  let responseList = [];
  let responseInfoList = [];

  if(adminUsernameList.includes(userName)){
    responseList = await prisma.response.findMany({

        orderBy: [
            {
              updatedAt: "desc",
            },
          ],
        });
      
        responseInfoList = JSON.parse(JSON.stringify(responseList, replacer));
    }
    
    return {
      props: {responseInfoList},
    };
  }
*/