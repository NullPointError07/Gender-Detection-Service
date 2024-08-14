import express from "express";
import { connectDB } from "./src/db/connectDB";
import { GdSetQueueRouter } from "./src/routes/gdSetQueueRouter";
import { GdQueueProcessorRouter } from "./src/routes/gdQueueProcessorRouter";
import { processQueue } from "./src/services/processQueue";
import { cronPublish } from "./src/services/cronPublish";
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

app.get("/mock", (req, res) => {
  cronPublish();
});

const queueProcessorJob = CronJob.from({
  // cronTime: "0 * * * * *",
  cronTime: "*/5 * * * *", // means it will run everyday at every 10 mins
  onTick: function () {
    processQueue();
  },
  start: true,
});

const publisherJob = CronJob.from({
  // cronTime: "0 * * * * *",
  cronTime: "0 * * * * *",
  onTick: function () {
    cronPublish();
  },
  start: true,
});

// const jobQueueAdjustment = CronJob.from({
//   cronTime: "0 6 * * *",
//   onTick: function () {
//     cronQueueAdjustment();
//   },
//   start: true,
// });

// this is just demo, it will be cron
app.get("/queue-adjustment", (req, res) => {
  cronQueueAdjustment();
});

app.post("/mock-ai", (req, res) => {
  console.log("Received data:", req.body);

  setTimeout(() => {
    res
      .status(200)
      .json({ status: 0, error_type: "timeout", detail: "process timeout" });
  }, 3000);
});

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
