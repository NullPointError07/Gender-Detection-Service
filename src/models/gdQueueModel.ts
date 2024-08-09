import mongoose, { Document, Schema } from "mongoose";

export interface GdQueue extends Document {
  present_id: mongoose.Types.ObjectId;
  q_status: "pending" | "in-progress";
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
      enum: ["pending", "in-progress"],
      default: "pending",
    },
    s3_bucket_url: { type: String, required: true },
    gp_cdn_url: { type: String, required: true },
    cloud_front_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const GdQueueModel = mongoose.model<GdQueue>("gd_queue", GdQueueSchema);
