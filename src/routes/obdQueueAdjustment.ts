import express from "express";
import { queueAdjustmentJob } from "../services/cronJobs/queueAdjustmentJob";

const router = express.Router();

// START queue-adjustment-job
router.get("/start", async (req, res) => {
  console.log("starting queue-adjustment");
  queueAdjustmentJob.start();
  console.log("queue-adjustment started");
  res.status(200).json({ message: "queue-adjustment started successfully" });
});

// STOP queue-adjustment-job
router.get("/stop", async (req, res) => {
  console.log("stopping queue-adjustment");
  queueAdjustmentJob.stop();
  console.log("queue-adjustment stopped");
  res.status(200).json({ message: "queue-adjustment stopped successfully" });
});

export { router as QueueAdjustment };
