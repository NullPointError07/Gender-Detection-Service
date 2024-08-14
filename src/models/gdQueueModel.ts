import mongoose, { Document, Schema } from "mongoose";
import { QueueStatus } from "../enums";

export interface GdQueue extends Document {
  present_id: mongoose.Types.ObjectId;
  q_status: QueueStatus;
  s3_bucket_url: string;
  gp_cdn_url: string;
  cloud_front_url: string;
  createdAt: Date;
  updatedAt: Date;
}

const GdQueueSchema: Schema = new Schema(
  {
    present_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    q_status: {
      type: String,
      enum: Object.values(QueueStatus),
      default: QueueStatus.PENDING,
    },
    s3_bucket_url: { type: String, required: true },
    gp_cdn_url: { type: String, required: true },
    cloud_front_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const GdQueueModel = mongoose.model<GdQueue>(
  "gd_queue",
  GdQueueSchema,
  "gd_queue"
);
