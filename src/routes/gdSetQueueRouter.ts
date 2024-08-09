import express from "express";
import { GdQueueModel } from "../models/gdQueueModel";

const router = express.Router();

/**
 * @description: "This Function sets a new video in gender detection queue"
 */
router.post("/", async (req, res) => {
  const { present_id, s3_bucket_url, gp_cdn_url, cloud_front_url } = req.body;

  if (!present_id || !s3_bucket_url || !gp_cdn_url || !cloud_front_url) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await GdQueueModel.create(req.body);
    res.status(201).json({ status: 1, message: "Queue Set Successfully" });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Queue Set Failure",
      error: (error as Error).message,
    });
  }
});

export { router as GdSetQueueRouter };
