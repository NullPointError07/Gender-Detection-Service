import mongoose, { Schema } from "mongoose";
import { ApiResponseSuccess, ApiResponseSuccessSchema } from "./apiResponse";
import { onCompleteStatus } from "../enums";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface GdQueueCompleted extends SharedFields {
  video_processor_api_response: ApiResponseSuccess;
  max_person_count: number;
  male_percentage: number;
  female_percentage: number;
  total_frame_count: number;
  frame_rate: string;
  duration: string;
  publish_status: onCompleteStatus;
}

const GdQueueCompletedSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
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
    publish_status: {
      type: String,
      enum: Object.values(onCompleteStatus),
      default: onCompleteStatus.UNPUBLISHED,
    },
  },
  { timestamps: true }
);

export const GdQueueCompletedModel = mongoose.model<GdQueueCompleted>(
  "gd_queue_completed",
  GdQueueCompletedSchema,
  "gd_queue_completed"
);
