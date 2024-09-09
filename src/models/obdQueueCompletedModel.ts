import mongoose, { Schema } from "mongoose";
import { ApiResponseOk, ApiResponseOkSchema } from "./apiResponseOk";
import { onCompleteStatus } from "../enums";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface ObdQueueCompleted extends SharedFields {
  video_processor_api_response: ApiResponseOk;
  max_person_count: number;
  male_percentage: number;
  female_percentage: number;
  total_frame_count: number;
  frame_rate: string;
  duration: string;
  publish_status: onCompleteStatus;
}

const ObdQueueCompletedSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: ApiResponseOkSchema,
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

export const ObdQueueCompletedModel = mongoose.model<ObdQueueCompleted>(
  "obd_queue_completed",
  ObdQueueCompletedSchema,
  "obd_queue_completed"
);
