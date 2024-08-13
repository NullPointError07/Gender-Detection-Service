import express from "express";
import { processQueue } from "../services/processQueue";

const router = express.Router();

/**
 * @description: "This demo route will process queue in future it will be cron job"
 */
router.get("/", async (req, res) => {
  processQueue();
});

export { router as GdQueueProcessorRouter };
