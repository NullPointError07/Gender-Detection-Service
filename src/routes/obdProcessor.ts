import express from "express";
import { processorJob } from "../services/cronJobs/processorJob";

const router = express.Router();

router.post("/start", async (req, res) => {
  console.log("starting obd-processor");
  processorJob.start();
  console.log("obd-processor started");
  res.status(200).json({ message: "obd-processor started successfully" });
});

router.post("/stop", async (req, res) => {
  console.log("stopping obd-processor");
  processorJob.stop();
  console.log("obd-processor stopped");
  res.status(200).json({ message: "obd-processor stopped successfully" });
});

export { router as ObdProcessor };
