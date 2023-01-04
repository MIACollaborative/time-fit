
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

function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function ObjectListExortToolbar({ infoList, userInfo, filePrefix}) {

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
    <div>
      <Button variant="contained" onClick={(event) => {
      // infoList
      const fileString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(infoList)
      )}`;
      const link = document.createElement("a");
      link.href = fileString;

      let timeString = DateTime.now().toISO();

      link.download = `${filePrefix}_downloaded_by_${userInfo.username}_${timeString}.json`;
  
      link.click();

    }} >Export JSON</Button>&nbsp;&nbsp;
    <Button variant="contained" onClick={(event) => {

      let csvString = GeneralUtility.getTSVStringFromObjectList(infoList);

      // infoList
      // for CSV
      /*
      const jsonString = `data:	text/csv;chatset=utf-8,${encodeURIComponent(
        csvString
      )}`;
      */

      // for TSV
      const fileString = `data:	text/tab-separated-values;chatset=utf-8,${encodeURIComponent(
        csvString
      )}`;


      const link = document.createElement("a");
      link.href = fileString;

      let timeString = DateTime.now().toISO();

      link.download = `${filePrefix}_downloaded_by_${userInfo.username}_${timeString}.tsv`;
  
      link.click();

    }} >Export TSV</Button>
    
    </div>
    </Fragment>
  )
}
