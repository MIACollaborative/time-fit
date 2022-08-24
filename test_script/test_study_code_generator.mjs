//import md5 from "md5";
//import ServerService from "./utilities/ServerService";
import { timer } from "rxjs";
import { map, takeWhile} from "rxjs/operators";

import cryptoRandomString from 'crypto-random-string';

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


let initialDelay = 1000;
let interval = 1000;
let startIndex = 1;
let endIndex = 51;

let prefix = `participant`;

timer(initialDelay, interval).pipe(
  takeWhile(x => {
    return startIndex + x < endIndex;
  }),
  map(x => {
    // pilot
    //let studyCode = `pilotB${startIndex + x}`;
    // study
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

    return newStudyCodeObj;
  })
).subscribe(newStudyCodeObj => {
  console.log(newStudyCodeObj);

  /*
  ServerService.submitOrReplaceInTable("study_code", newStudyCodeObj, false)
  .then(response => {
    console.log(`Successfully insert [${newStudyCodeObj.note}]: ${newStudyCodeObj.code}`);
  })
  .catch(error => console.error(error))
  .finally();
  */


});
