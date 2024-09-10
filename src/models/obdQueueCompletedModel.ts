import mongoose, { Schema } from "mongoose";
import { AiModelResponseOk, AiModelResponseOkSchema } from "./aiModelResponseOk";
import { onCompleteStatus } from "../enums";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface ObdQueueCompleted extends SharedFields {
  video_processor_api_response: AiModelResponseOk;
  publish_status: onCompleteStatus;
}

const ObdQueueCompletedSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: AiModelResponseOkSchema,
      required: true,
    },
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
