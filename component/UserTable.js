
/*
import logger from "../lib/logger";

*/

import React, { useState } from 'react';
import { DateTime, Interval } from "luxon";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import GeneralUtility from '../lib/GeneralUtility.mjs';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import Link from "next/link";
import { Fragment } from 'react';
import ObjectListExortToolbar from './ObjectListExortToolbar.js';

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function UserTable({ infoList, userInfo, hostURL }) {

  /*
  id  String  @id @default(auto()) @map("_id") @db.ObjectId
  username String @unique
  password String
  hash String @unique

  // additional user information
  preferredName String?
  phone String?
  timezone String?

  // for study management
  phase String @default("baseline") // baseline vs. intervention
  joinAt DateTime?
  activateAt DateTime?
  fitbitReminderTurnOff Boolean? @default(false)
  saveWalkToJoyToContacts Boolean? @default(false)

  // for group assignment
  gif Boolean? @default(false)
  salience Boolean? @default(false)
  modification Boolean? @default(false)

  // reference other collections
  taskLogList  taskLog[]


  // for Fitbit
  fitbitId String?
  fitbitDisplayName String?
  fitbitFullName String?
  accessToken String?
  refreshToken String?

  // for Fitbit data and subscription
  fitbitSubscriptionList fitbit_subscription[]
  fitbitUpdateList fitbit_update[]
  fitbitDataList fitbit_data[]
  

  // for survey response
  responseList response[]

  // for user preference
  weekdayWakeup DateTime?
  weekdayBed DateTime?
  weekendWakeup DateTime?
  weekendBed DateTime?


  // for time
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt
  */

  return (
    <Fragment>
      <br />
      <ObjectListExortToolbar filePrefix={"User"} infoList={infoList} userInfo={userInfo}></ObjectListExortToolbar>
      <br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Action</TableCell>
              <TableCell align="right">User Name</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Timezone</TableCell>
              <TableCell align="right">Phase</TableCell>
              <TableCell align="right">Join At</TableCell>
              <TableCell align="right">Activate At</TableCell>
              <TableCell align="right">Gif</TableCell>
              <TableCell align="right">Salience</TableCell>
              <TableCell align="right">Modification</TableCell>
              <TableCell align="right">Fitbit Id</TableCell>
              <TableCell align="right">Weekday Wakeup</TableCell>
              <TableCell align="right">Weekday Bed</TableCell>
              <TableCell align="right">Weekend Wakeup</TableCell>
              <TableCell align="right">Weekend Bed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {infoList.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">
                  <Link href={`/user-edit?user=${row.username}`}>
                    <Button variant="contained">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
                <TableCell align="right">{row.timezone}</TableCell>
                <TableCell align="right">{row.phase}</TableCell>
                <TableCell align="right">{row.joinAt}</TableCell>
                <TableCell align="right">{row.activateAt}</TableCell>
                <TableCell align="right">{JSON.stringify(row.gif)}</TableCell>
                <TableCell align="right">{JSON.stringify(row.salience)}</TableCell>
                <TableCell align="right">{JSON.stringify(row.modification)}</TableCell>
                <TableCell align="right">{row.fitbitId}</TableCell>
                <TableCell align="right">{row.weekdayWakeup}</TableCell>
                <TableCell align="right">{row.weekdayBed}</TableCell>
                <TableCell align="right">{row.weekendWakeup}</TableCell>
                <TableCell align="right">{row.weekendBed}</TableCell>
              </TableRow>
            ))}
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