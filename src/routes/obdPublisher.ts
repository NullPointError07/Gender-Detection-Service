import express from "express";
import { publisherJob } from "../services/cronJobs/publisherJob";

const router = express.Router();

// START obd-publisher-job
router.post("/start", async (req, res) => {
  console.log("starting obd-publisher");
  publisherJob.start();
  console.log("obd-publisher started");
  res.status(200).json({ message: "obd-publisher started successfully" });
});

// STOP obd-publisher-job
router.post("/stop", async (req, res) => {
  console.log("stopping obd-publisher");
  publisherJob.stop();
  console.log("obd-publisher stopped");
  res.status(200).json({ message: "obd-publisher stopped successfully" });
});

export { router as ObdPublisher };
