
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
import { DateTime } from "luxon";
import GeneralUtility from '../lib/GeneralUtility.mjs';

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function SurveyResponseTable({ infoList }) {

  /*
  <TableCell>Id</TableCell>
  <TableCell component="th" scope="row">
    {row.id}
  </TableCell>
  */

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Participant Id</TableCell>
            <TableCell align="right">Survey Id</TableCell>
            <TableCell align="right">Date Time (your time)</TableCell>
            <TableCell align="right">Date Time</TableCell>
            <TableCell align="right">Content</TableCell>
            <TableCell align="right">Survey Link</TableCell>
            <TableCell align="right">Survey Params String</TableCell>
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
              <TableCell align="right">{row.participantId}</TableCell>
              <TableCell align="right">{row.surveyId}</TableCell>
              <TableCell align="right">{DateTime.fromISO(row.dateTime).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
              <TableCell align="right">{row.dateTime}</TableCell>
              <TableCell align="right">{row.content}</TableCell>
              <TableCell align="right">{row.surveyLink}</TableCell>
              <TableCell align="right">{row.surveyParamsString}</TableCell>
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