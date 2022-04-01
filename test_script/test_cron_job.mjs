import nodeCron from "node-cron";
import axios from "axios";
import { DateTime } from "luxon";

// '*/2 * * * * *' -> every 2 seconds
// '*/10 * * * * *' -> every 10 seconds
// '* * * * *' -> every 1 minute

let everyTenSecondsExpression = '*/10 * * * * *';
let everyOneMinuteExpression = '* * * * *';

nodeCron.schedule(everyOneMinuteExpression, async () => {
    console.log(`execute task every 1 minute at ${DateTime.now()}`);
    let weekdayWakeupPromise = axios({
      method: 'post',
      url: 'http://localhost:3000/api/cron',
      // `headers` are custom headers to be sent
      params: {
        'function_name': 'check_user_weekday_wakeup_time',
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

  });


