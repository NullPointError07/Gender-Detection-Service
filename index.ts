import express, { Request, Response } from "express";
import { connectDB } from "./src/db/connectDB";
import { GdSetQueueRouter } from "./src/routes/gdSetQueueRouter";
import { GdQueueProcessorRouter } from "./src/routes/gdQueueProcessorRouter";
import { processQueue } from "./src/services/processQueue";
import { cronOutputPublisher } from "./src/services/cronOutputPublisher";
import { cronQueueAdjustment } from "./src/services/cronQueueAdjustment";
import { CronJob } from "cron";

const app = express();
app.use(express.json());

const port = 6969;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Gender Detection Service");
});

app.use("/gd-set-queue", GdSetQueueRouter);
app.use("/gd-queue-processor", GdQueueProcessorRouter);


// define gd-prcessor-job
const queueProcessorJob = CronJob.from({
  cronTime: "*/15 * * * *", // means it will run everyday at every 5 mins
  onTick: function () {
    processQueue();
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
  cronTime: "* * * * *", // means it will run everyday at every 1 min
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
  cronTime: "* * * * *", // means it will run everyday at every 6 a.m
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

// app.get("/mock", (req, res) => {
//   cronOutputPublisher();
// });

// this is just demo, it will be cron
// app.get("/queue-adjustment", (req, res) => {
//   cronQueueAdjustment();
// });

// app.post("/mock-ai", (req, res) => {
//   console.log("Received data:", req.body);

//   setTimeout(() => {
//     res
//       .status(200)
//       .json({ status: 0, error_type: "timeout", detail: "process timeout" });
//   }, 3000);
// });

// app.post("/mock-ai", (req, res) => {
//   console.log("Received data:", req.body);

//   setTimeout(() => {
//     res.status(200).json({
//       status: 1,
//       data: {
//         max_person_count: 2,
//         male_percentage: 55.56,
//         female_percentage: 44.44,
//         total_frame_count: 427,
//         video_duration: "0h 1m 25s",
//       },
//     });
//   }, 5000);
// });

// app.post("/mock-fanfare", (req, res) => {
//   console.log("Received data:", req.body);

//   setTimeout(() => {
//     res.status(200).json({ status: 1, msg: "gd publish success" });
//   }, 3000);
// });

// app.post("/mock-fanfare", (req, res) => {
//   console.log("Received data:", req.body);

//   setTimeout(() => {
//     res
//       .status(200)
//       .json({ status: 0, error_type: "timeout", msg: "random fail message" });
//   }, 3000);
// });

app.listen(port, () => {
  console.log(`Server has started on port http://localhost:${port}/`);
});
