import express from "express";
import { ObdQueueModel } from "../models/obdQueueModel";
import { obdSetQueue } from "../services/obdSetQueue";

const router = express.Router();

/**
 * @description: "This Function sets a new video in Object detection queue"
 */
router.post("/", async (req, res) => {
  console.log("+------------ NEW QUEUE-ITEM COMING THROUGH ---------+");

  await obdSetQueue(req, res);
});

export { router as ObdSetQueueRouter };
