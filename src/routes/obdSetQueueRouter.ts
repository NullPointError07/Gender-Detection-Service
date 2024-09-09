import express from "express";
import { ObdQueueModel } from "../models/obdQueueModel";

const router = express.Router();

/**
 * @description: "This Function sets a new video in Object detection queue"
 */
router.post("/", async (req, res) => {
  console.log("+------------ NEW QUEUE-ITEM COMING THROUGH ---------+");
  console.log("| Payload data: ", req.body);

  const { present_id, s3_bucket_url, gp_cdn_url, cloud_front_url } = req.body;

  if (!present_id || !s3_bucket_url || !gp_cdn_url || !cloud_front_url) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await ObdQueueModel.create(req.body);
    console.log("| Queue set successful");
    console.log("+-------------- END -----------+");
    res.status(201).json({ status: 1, message: "Queue Set Successfully" });
  } catch (error) {
    console.log("| Queue set FAILED");
    console.log("+-------------- END -----------+");
    res.status(500).json({
      status: 0,
      message: "Queue Set Failure",
      error: (error as Error).message,
    });
  }
});

export { router as ObdSetQueueRouter };
