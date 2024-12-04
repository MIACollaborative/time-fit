import nodeCron from "node-cron";
import axios from "axios";
import { DateTime } from "luxon";

let expressionLabelDict = {
  "1 minute": {
      label: 'every 1 minute',
      expression: '* * * * *'
  },
  "10 seconds": {
      label: 'every 10 seconds',
      expression: '*/10 * * * * *'
  }

};

let theExpression = expressionLabelDict["1 minute"];

let lastDate = undefined;

async function postClockEvent(date){
  let thePromise = axios({
    method: 'post',
    url: 'http://localhost:3000/api/cron',
    // `headers` are custom headers to be sent
    params: {
      'function_name': 'execute_task',//  'check_user_weekday_wakeup_time',
      'date': DateTime.fromJSDate(date).toISO()
    }
  })
  .then((response) => {
    //console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    //console.log(response.headers);
    //console.log(response.config);

    let data = response.data;
    console.log(`Cron result: ${JSON.stringify(data)}`);
    return data;
  });

  return thePromise;
}

nodeCron.schedule(theExpression.expression, async () => {
  let cronTime = process.hrtime();
  console.log(`execute cron event generation task ${theExpression.label} at ${cronTime}`);
  let t1 = process.hrtime();

  // for testing: 2022-09-19 08:00 PM 000 milliseconds
  //let now = new Date(2023, 5, 16, 10, 0, 1); //EDT/EST
  let now = DateTime.now().toJSDate();
  
  // for real
  //let now = DateTime.now().toJSDate();

  // ensure that the lasteDate is not the same as now at the minute level
  let cEvent = new ClockEvent("clock", "system-user", now);

  if(lastDate != undefined){
      let lastDateMinute = DateTime.fromJSDate(lastDate).startOf("minute").toJSDate();
      let nowMinute = DateTime.fromJSDate(now).startOf("minute").toJSDate();
      if(lastDateMinute.getTime() != nowMinute.getTime()){
          
          console.log(`Event: ${JSON.stringify(cEvent)}`);
          await postClockEvent(now);
          console.log(`${DateTime.fromJSDate(now).toISO()}: post clock event`);
      }
      else{
          console.log(`${DateTime.fromJSDate(now).toISO()}: Skipping event generation as lastDate and now are the same at the minute level`);
      }
  }
  else{
    await postClockEvent(now);
      console.log(`${DateTime.fromJSDate(now).toISO()}: post clock event`);  
  }

  lastDate = now;
  
  let t2 = process.hrtime(t1);
  console.log('did tick in', t2[0] * 1000 + t2[1] / 100000, 'ms');
}, {recoverMissedExecutions: true});


/*
nodeCron.schedule(theExpression.expression, async () => {
    console.log(`execute task ${theExpression.label} at ${DateTime.now()}`);
    let thePromise = axios({
      method: 'post',
      url: 'http://localhost:3000/api/cron',
      // `headers` are custom headers to be sent
      params: {
        'function_name': 'execute_task',//  'check_user_weekday_wakeup_time',
      }
    })
    .then((response) => {
      //console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      //console.log(response.headers);
      //console.log(response.config);

      let data = response.data;
      console.log(`Cron result: ${JSON.stringify(data)}`);
      return data;
    });

    return thePromise;

  });
*/


