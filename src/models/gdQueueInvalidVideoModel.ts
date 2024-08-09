import mongoose, { Document, Schema } from "mongoose";
import { ApiResponseFail, ApiResponseFailSchema } from "./apiResponse";

export interface GdQueueInvalidVideo extends Document {
  present_id: mongoose.Types.ObjectId;
  s3_bucket_url: string;
  gp_cdn_url: string;
  cloud_front_url: string;
  video_processor_api_response: ApiResponseFail;
  createdAt: Date;
  updatedAt: Date;
}

const GdQueueInvalidVideoSchema: Schema = new Schema(
  {
    present_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    s3_bucket_url: { type: String, required: true },
    gp_cdn_url: { type: String, required: true },
    cloud_front_url: { type: String, required: true },
    video_processor_api_response: {
      type: ApiResponseFailSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const GdQueueInvalidVideoModel = mongoose.model<GdQueueInvalidVideo>(
  "gd_queue_invalid_video",
  GdQueueInvalidVideoSchema
);
