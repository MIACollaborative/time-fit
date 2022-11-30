
/*
import logger from "../lib/logger";

*/

import React, { useState, Fragment } from 'react';
import { Button } from '@mui/material';
import { DateTime, Interval } from "luxon";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function FitbitDataTable({ infoList, userInfo}) {

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

  console.log(`FitbitDataTable: ${JSON.stringify(infoList, null, 2)}`);


  return (
    <Fragment>
    <br/>
    <div>
      <Button variant="contained" onClick={(event) => {
      // infoList
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(infoList)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;

      let timeString = DateTime.now().toISO();
      let tableName = "FitbitData";

      link.download = `${tableName}_downloaded_by_${userInfo.username}_${timeString}.json`;
  
      link.click();

    }} >Export JSON</Button>&nbsp;&nbsp;
    <Button variant="contained" onClick={(event) => {

      let csvString = GeneralUtility.getCSVStringFromObjectList(infoList);

      // infoList
      const jsonString = `data:	text/csv;chatset=utf-8,${encodeURIComponent(
        csvString
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;

      let timeString = DateTime.now().toISO();
      let tableName = "FitbitData";

      link.download = `${tableName}_downloaded_by_${userInfo.username}_${timeString}.csv`;
  
      link.click();

    }} >Export CSV</Button>
    
    </div>
    <br/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Owner Id</TableCell>
            <TableCell align="right">Data Type</TableCell>
            <TableCell align="right">Date Time</TableCell>
            <TableCell align="right">Content</TableCell>
            <TableCell align="right">Last Modified</TableCell>
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
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.owner.username}</TableCell>
              <TableCell align="right">{row.ownerId}</TableCell>
              <TableCell align="right">{row.dataType}</TableCell>
              <TableCell align="right">{row.dateTime}</TableCell>
              <TableCell align="right">{JSON.stringify(row.content, null, 2)}</TableCell>
              <TableCell align="right">{row.lastModified}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">{row.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Fragment>
  )
}
