
/*
import logger from "../lib/logger";

*/

import React, { useState, Fragment } from 'react';
import { Button } from '@mui/material';
import { DateTime, Interval } from "luxon";
import GeneralUtility from '../lib/GeneralUtility.mjs';
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

export default function UpdateDiffTable({ infoList, userInfo}) {

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
      let tableName = "UpdateDiff";

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
      let tableName = "UpdateDiff";

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
            
            <TableCell align="right">Collection Name</TableCell>
            <TableCell align="right">Document Id</TableCell>
            <TableCell align="right">Document Diff</TableCell>
            <TableCell align="right">Created At (your time)</TableCell>
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
              <TableCell align="right">{row.collectionName}</TableCell>
              <TableCell align="right">{row.documentId}</TableCell>
              <TableCell align="right">{JSON.stringify(row.documentDiff, null, 2)}</TableCell>
              <TableCell align="right">{DateTime.fromISO(row.createdAt).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
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
