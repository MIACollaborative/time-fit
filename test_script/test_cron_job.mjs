import nodeCron from "node-cron";


nodeCron.schedule('*/2 * * * * *', () => {
    console.log('execute task every 2 seconds');
  });


