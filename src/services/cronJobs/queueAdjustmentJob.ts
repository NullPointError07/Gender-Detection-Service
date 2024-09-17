import { CronJob } from "cron";
import { cronQueueAdjustment } from "../cronQueueAdjustment";

// define queue-adjustment-job
export const queueAdjustmentJob = CronJob.from({
  // cronTime: "*/10 * * * * *", // for development testing purpose only
  cronTime: "0 6 * * *", // means it will run everyday at every 6 a.m
  onTick: function () {
    cronQueueAdjustment();
  },
  start: false,
});
