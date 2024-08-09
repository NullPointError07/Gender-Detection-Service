import express from "express";
import axios from "axios";
import { processQueue } from "../services/processQueue";

const router = express.Router();

router.get("/", async (req, res) => {
  processQueue();
});

export { router as GdQueueProcessorRouter };
