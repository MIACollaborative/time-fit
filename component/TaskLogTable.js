
/*
import logger from "../lib/logger";

*/

import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import GeneralUtility from '../lib/GeneralUtility.mjs';


function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function TaskLogTable({ infoList }) {

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Task Label</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Pre Condition</TableCell>
            <TableCell align="right">Randomization</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Execution Result</TableCell>
            <TableCell align="right">User Info Cache</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infoList.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{row.taskLabel}</TableCell>
              <TableCell align="right">{row.username}</TableCell>
              <TableCell align="right">{JSON.stringify(row.preConditionResult)}</TableCell>
              <TableCell align="right">{GeneralUtility.convertRandomizationResultToString(row.randomizationResult)}</TableCell>
              <TableCell align="right">{GeneralUtility.extractOutcomeToString(row.randomizationResult.theChoice)}</TableCell>
              <TableCell align="right" style={row.executionResult.value.errorMessage == null || row.executionResult.value.errorMessage == ""? {}:{background: "lightcoral"}}>{GeneralUtility.convertExecutionResultToString(row.executionResult)}</TableCell>
              <TableCell align="right">{GeneralUtility.extractUserKeyAttributesToString(row.userInfoCache)}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">{row.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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