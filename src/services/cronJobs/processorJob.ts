import { CronJob } from "cron";
import { processQueue } from "../processQueue";

let isProcessorBusy = false;

// define obd-prcessor-job
export const processorJob = CronJob.from({
  cronTime: "*/5 * * * *",
  onTick: async function () {
    console.log("+---------------- PROCESSOR-JOB AWAKE ---------------+");
    if (!isProcessorBusy) {
      console.log("| Processor is free, take action");
      isProcessorBusy = true;
      try {
        console.log(
          "| About to start processing, processor is flagged as busy\n\n"
        );
        await processQueue();
      } catch (error) {
        console.log("| An error occurred while processing");
      } finally {
        isProcessorBusy = false;
        console.log(
          "| Processing completed, processor is flagged as free, waiting for next tick...."
        );
      }
    } else {
      console.log("| Processor is busy, skipping this tick");
      console.log("+---------------- END -----------------+");
    }
  },
  start: false,
});
