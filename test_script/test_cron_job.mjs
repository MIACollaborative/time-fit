import nodeCron from "node-cron";
import axios from "axios";
import { DateTime } from "luxon";

// '*/2 * * * * *' -> every 2 seconds
// '*/10 * * * * *' -> every 10 seconds
// '* * * * *' -> every 1 minute

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
//let everyTenSecondsExpression = '*/10 * * * * *';
//let everyOneMinuteExpression = '* * * * *';

let theExpression = expressionLabelDict["10 seconds"];


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

    /*
    let weekdayBedPromise = axios({
      method: 'post',
      url: 'http://localhost:3000/api/cron',
      // `headers` are custom headers to be sent
      params: {
        'function_name': 'check_user_weekday_bed_time',
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


    return Promise.all([weekdayWakeupPromise, weekdayBedPromise]);
    */
  });


