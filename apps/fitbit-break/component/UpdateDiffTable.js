
/*
import logger from "../lib/logger";

*/

import React, { useState, Fragment } from 'react';
import { Button } from '@mui/material';
import { DateTime } from "luxon";
import GeneralUtility from '../lib/GeneralUtility.mjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ObjectListExortToolbar from './ObjectListExortToolbar.js';

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function UpdateDiffTable({ infoList, userInfo, renderData }) {

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
      <ObjectListExortToolbar infoList={infoList} userInfo={userInfo} filePrefix={"UpdateDiff"}></ObjectListExortToolbar>
      <br/>
      {renderData? <TableContainer component={Paper}>
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
      </TableContainer>:null}
  
    </Fragment>
  )
}
