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


import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


function replacer(key, value) {
  if (typeof value === "Date") {
    return value.toString();
  }
  return value;
}

export default function TaskLogTable({ infoList, userInfo, renderData }) {

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

  

  const columns = [
    { field: 'taskLabel', headerName: 'Task Label', sortable: true, width: 140 },
    { field: 'username', headerName: 'Username',  sortable: true, width: 130 },
    { field: 'isActivated', headerName: 'isActivated',  sortable: true, width: 70,
    valueGetter: (params) =>
    `${JSON.stringify(params.row.isActivated)}`,},
    {
      field: 'activationReasoning',
      headerName: 'Activation Reasoning',
      width: 320,
      valueGetter: (params) =>
    `${JSON.stringify(params.row.activationReasoning)}`
    },
    {
      field: 'randomizationResult',
      headerName: 'Randomization Result',
      //description: 'This column has a value getter and is not sortable.',
      sortable: false,
      //width: 160,
      valueGetter: (params) =>
        `${GeneralUtility.convertRandomizationResultToString(params.row.randomizationResult)}`,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      // width: 160,
      valueGetter: (params) =>
      GeneralUtility.extractOutcomeToString(params.row.randomizationResult != undefined? params.row.randomizationResult.theChoice: undefined),
    },
    {
      field: 'executionResult',
      headerName: 'Execution Result',
      sortable: false,
      //width: 160,
      valueGetter: (params) =>
      GeneralUtility.convertExecutionResultToString(params.row.executionResult),
    },
    {
      field: 'createAtYourTime',
      headerName: 'Created At (your time)',
      sortable: true,
      width: 320,
      valueGetter: (params) =>
      DateTime.fromISO(params.row.createdAt).toLocaleString(DateTime.DATETIME_FULL),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: 320,
      valueGetter: (params) =>
      params.row.createdAt,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      sortable: true,
      //width: 160,
      valueGetter: (params) =>
      params.row.updatedAt,
    },
    {
      field: 'userInfoCache',
      headerName: 'User Info Cache',
      sortable: false,
      //width: 160,
      valueGetter: (params) =>
      GeneralUtility.extractUserKeyAttributesToString(params.row.userInfoCache),
    },
  ];


  
  let filteredInfoList = infoList;

  return (
    <Fragment>
      <br />
      <ObjectListExortToolbar filePrefix={"TaskLog"} infoList={infoList} userInfo={userInfo}></ObjectListExortToolbar>
      <br />
      {renderData? <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={infoList}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>: null}
    </Fragment>
  );;



}
