
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

export default function FitbitNotificationTable({infoList}) {

    // example


      // for subscription notification from Fitbit
  /*
  collectionType String
  date String
  ownerId String
  ownerType String
  subscriptionId String

  // for query data: notification -> processed
  status String @default("notification")

  // for security logging
  ip String?
  */

  console.log(`infoList: ${infoList}`);
  console.log(`typeof infoList: ${typeof infoList}`);
  //let filteredInfoList = GeneralUtility.removeFitbitUpdateDuplicate( infoList, true);
  let filteredInfoList = filteredInfoList; //GeneralUtility.removeFitbitUpdateDuplicate( infoList, true);
  console.log(`filteredInfoList: ${filteredInfoList}`);
  console.log(`typeof filteredInfoList: ${typeof filteredInfoList}`);


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Collection Type</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Owner Id</TableCell>
            <TableCell align="right">Owner Type</TableCell>
            <TableCell align="right">Subscription Id</TableCell>
            <TableCell align="right">IP</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInfoList.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.collectionType}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.ownerId}</TableCell>
              <TableCell align="right">{row.ownerType}</TableCell>
              <TableCell align="right">{row.subscriptionId}</TableCell>
              
              <TableCell align="right">{row.ip}</TableCell>
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