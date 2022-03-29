import nodeCron from "node-cron";
import axios from "axios";
import { DateTime } from "luxon";

// '*/2 * * * * *' -> every 2 seconds
// '* * * * *' -> every 1 minute
nodeCron.schedule('*/10 * * * * *', async () => {
    console.log(`execute task every 10 seconds at ${DateTime.now()}`);
    return axios({
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

    const result = await fetch(`/api/cron?function_name=check_user_weekday_wakeup_time`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      /*
      body: JSON.stringify({
        type: type,
        content: content
      }),
      */
    }).then((r) => {
      return r.json();
    });
    console.log(`Cron result: ${JSON.stringify(result)}`);
    return result;
  });


