//import md5 from "md5";
//import ServerService from "./utilities/ServerService";
import { timer } from "rxjs";
import { map, takeWhile} from "rxjs/operators";
import prisma from "../lib/prisma.mjs";
import cryptoRandomString from 'crypto-random-string';
import csvWriter from "csv-write-stream";
import fs from "fs";
import md5 from "md5";
import { DateTime } from "luxon";

async function insertUser(newStudyCodeObj){
  const {studyId, ...rest} = newStudyCodeObj;

  await prisma.users.upsert({
      where: {
        username: newStudyCodeObj.username
      },
      update: {
          ...rest
      },
      create: newStudyCodeObj,
  })
}

async function writeToCSV(resultList, outputFileName){
  var writer = csvWriter({ sendHeaders: true });
  writer.pipe(fs.createWriteStream(outputFileName));
  resultList.forEach((result) => {
    writer.write(result);
  });
  writer.end();
}


/*
for(let i = 17; i < 18; i++){
  let studyCode = `participant${i}`;
  let hashStudyCode = md5(studyCode);
  console.log(`[${studyCode}]: ${hashStudyCode}`);

  let newStudyCodeObj = {
    code: hashStudyCode,
    note: studyCode
  };

  ServerService.submitOrReplaceInTable("study_code", newStudyCodeObj, false)
    .then(response => {
      console.log(`Successfully insert [${studyCode}]: ${hashStudyCode}`);
    })
    .catch(error => console.error(error))
    .finally();
}
*/

function generateGroupAssignmentList(populationSize){
  let gList = [];

  for(let i = 0; i < populationSize; i++){
      let groupAssignment = {
          gif: Math.floor(i/4),
          salience: Math.floor(i%4/2),
          modification: i%2
      };
      console.log(`${i}: [${groupAssignment.gif}, ${groupAssignment.salience}, ${groupAssignment.modification}]`);

      gList.push(groupAssignment);
  }

  return gList;
}




let initialDelay = 1000;
let interval = 1000;
let startIndex = 1;
let endIndex = 5;

let prefix = `alpha`;


let groupAssignmnetList = generateGroupAssignmentList(endIndex - startIndex);

console.log();

let resultList = [];

for(let i = startIndex; i < endIndex; i++){
  let username = `${prefix}${i}`;
    
  //let hashStudyCode = md5(studyCode);
  // cryptoRandomString({length: 10, type: 'alphanumeric'});
  // let hashStudyCode = cryptoRandomString({length: 8, characters: 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'});
  let password = cryptoRandomString({length: 8, characters: 'abcdefghijkmnpqrstuvwxyz023456789'});

  let hash = md5(password);

  let gAssignment = groupAssignmnetList[i - startIndex];

  console.log(`[${username}]: ${password}`);
  let newStudyCodeObj = {
    username,
    password,
    hash
    /*
    gif: gAssignment[0] ==1? true: false,
    salience: gAssignment[1] ==1? true: false,
    modification: gAssignment[2] ==1? true: false,
    */
  };

  resultList.push(newStudyCodeObj);

}

let dateString = DateTime.now().toISO({ format: 'basic', includeOffset: false });

let exportFileName = `${prefix}_${dateString}.csv`;

await writeToCSV(resultList, exportFileName);



timer(initialDelay, interval).pipe(
  takeWhile(x => {
    return startIndex + x < endIndex;
  }),
  map(x => {

    let newStudyCodeObj = resultList[x];



    /*
    let studyCode = `${prefix}${startIndex + x}`;
    
    //let hashStudyCode = md5(studyCode);
    // cryptoRandomString({length: 10, type: 'alphanumeric'});
    // let hashStudyCode = cryptoRandomString({length: 8, characters: 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'});
    let hashStudyCode = cryptoRandomString({length: 8, characters: 'abcdefghijkmnpqrstuvwxyz023456789'});

    console.log(`[${studyCode}]: ${hashStudyCode}`);
    let newStudyCodeObj = {
      studyId: studyCode,
      passCode: hashStudyCode,
    };
    */

    return newStudyCodeObj;
  })
).subscribe(newStudyCodeObj => {
  console.log(newStudyCodeObj);

  insertUser(newStudyCodeObj);



  /*
  ServerService.submitOrReplaceInTable("study_code", newStudyCodeObj, false)
  .then(response => {
    console.log(`Successfully insert [${newStudyCodeObj.note}]: ${newStudyCodeObj.code}`);
  })
  .catch(error => console.error(error))
  .finally();
  */


});
