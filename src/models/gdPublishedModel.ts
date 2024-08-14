import mongoose, { Document, Schema } from "mongoose";
import { ApiResponseSuccess, ApiResponseSuccessSchema } from "./apiResponse";
import {
  GdPublishApiResponse,
  GdPublishApiResponseSchema,
} from "./gdPublishApiResponse";

export interface GdPublished extends Document {
  present_id: mongoose.Types.ObjectId;
  s3_bucket_url: string;
  gp_cdn_url: string;
  cloud_front_url: string;
  video_processor_api_response: ApiResponseSuccess;
  max_person_count: number;
  male_percentage: number;
  female_percentage: number;
  total_frame_count: number;
  frame_rate: string;
  duration: string;
  gd_publisher_api_response: GdPublishApiResponse;
  createdAt: Date;
  updatedAt: Date;
}

export const GdPublishedSchema: Schema = new Schema(
  {
    present_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    s3_bucket_url: { type: String, required: true },
    gp_cdn_url: { type: String, required: true },
    cloud_front_url: { type: String, required: true },
    video_processor_api_response: {
      type: ApiResponseSuccessSchema,
      required: true,
    },
    max_person_count: { type: Number, required: true },
    male_percentage: { type: Number, required: true },
    female_percentage: { type: Number, required: true },
    total_frame_count: { type: Number, required: true },
    frame_rate: { type: String, required: true },
    duration: { type: String, required: true },
    gd_publisher_api_response: {
      type: GdPublishApiResponseSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const GdPublishedModel = mongoose.model<GdPublished>(
  "gd_published",
  GdPublishedSchema,
  "gd_published"
);
