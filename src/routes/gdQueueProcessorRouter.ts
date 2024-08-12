import express from "express";
import { processQueue } from "../services/processQueue";

const router = express.Router();

router.get("/", async (req, res) => {
  processQueue();
});

export { router as GdQueueProcessorRouter };
