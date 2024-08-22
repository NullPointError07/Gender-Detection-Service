import express, { Request, Response } from "express";
import { connectDB } from "./src/db/connectDB";
import { GdSetQueueRouter } from "./src/routes/gdSetQueueRouter";
import { processQueue } from "./src/services/processQueue";
import { GdQueueProcessorRouter } from "./src/routes/gdQueueProcessorRouter";
import { cronOutputPublisher } from "./src/services/cronOutputPublisher";
import { cronQueueAdjustment } from "./src/services/cronQueueAdjustment";
import { CronJob } from "cron";

const app = express();
app.use(express.json());

const port = 6969;

connectDB();

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Welcome to Gender Detection Service");
});

app.use("/gd-set-queue", GdSetQueueRouter);
app.use("/gd-queue-processor", GdQueueProcessorRouter);

let isProcessorBusy = false;

// define gd-prcessor-job
const queueProcessorJob = CronJob.from({
  cronTime: "*/5 * * * *",
  onTick: async function () {
    console.log("+---------------- PROCESSOR-JOB AWAKE ---------------+");
    if (!isProcessorBusy) {
      console.log("| Processor is free, take action");
      isProcessorBusy = true;
      try {
        console.log("| About to start processing, processor is flagged as busy\n\n");
        await processQueue();
      } catch (error) {
        console.log("| An error occurred while processing");
      } finally {
        isProcessorBusy = false;
        console.log("| Processing completed, processor is flagged as free, waiting for next tick....");
      }
    } else {
      console.log("| Processor is busy, skipping this tick");
      console.log("+---------------- END -----------------+");
    }
  },
  start: false,
});
// START gd-processor-job
app.get("/start-gd-processor", (req: Request, res: Response) => {
  console.log("starting gd-processor");
  queueProcessorJob.start();
  console.log("gd-processor started");
  res.status(200).json({ message: "gd-processor started successfully" });
});
// STOP gd-processor-job
app.get("/stop-gd-processor", (req: Request, res: Response) => {
  console.log("stopping gd-processor");
  queueProcessorJob.stop();
  console.log("gd-processor stopped");
  res.status(200).json({ message: "gd-processor stopped successfully" });
});

// define gd-publisher-job
const publisherJob = CronJob.from({
  cronTime: "10 * * * * *", 
  onTick: function () {
    cronOutputPublisher();
  },
  start: false,
});
// START gd-publisher-job
app.get("/start-gd-publisher", (req: Request, res: Response) => {
  console.log("starting gd-publisher");
  publisherJob.start();
  console.log("gd-publisher started");
  res.status(200).json({ message: "gd-publisher started successfully" });
});
// STOP gd-publisher-job
app.get("/stop-gd-publisher", (req: Request, res: Response) => {
  console.log("stopping gd-publisher");
  publisherJob.stop();
  console.log("gd-publisher stopped");
  res.status(200).json({ message: "gd-publisher stopped successfully" });
});

// define queue-adjustment-job
const queueAdjustmentJob = CronJob.from({
  cronTime: "0 6 * * *", // means it will run everyday at every 6 a.m
  onTick: function () {
    cronQueueAdjustment();
  },
  start: false,
});
// START queue-adjustment-job
app.get("/start-queue-adjustment", (req: Request, res: Response) => {
  console.log("starting queue-adjustment");
  queueAdjustmentJob.start();
  console.log("queue-adjustment started");
  res.status(200).json({ message: "queue-adjustment started successfully" });
});
// STOP queue-adjustment-job
app.get("/stop-queue-adjustment", (req: Request, res: Response) => {
  console.log("stopping queue-adjustment");
  queueAdjustmentJob.stop();
  console.log("queue-adjustment stopped");
  res.status(200).json({ message: "queue-adjustment stopped successfully" });
});

app.listen(port, () => {
  console.log(
    `Gender Detection Micro Service has started on port http://localhost:${port}/`
  );
});
