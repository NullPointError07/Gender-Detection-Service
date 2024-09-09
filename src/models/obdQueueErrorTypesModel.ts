import mongoose, { Schema } from "mongoose";
import { ApiResponseFail, ApiResponseFailSchema } from "./apiResponseFail";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

interface ObdQueueErrorTypes extends SharedFields {
  video_processor_api_response: ApiResponseFail;
}

const ObdQueueErrorTypesSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: ApiResponseFailSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const ObdQueueErrorModel = mongoose.model<ObdQueueErrorTypes>(
  "gd_queue_error",
  ObdQueueErrorTypesSchema,
  "gd_queue_error"
);

export const ObdQueueInvalidVideoModel = mongoose.model<ObdQueueErrorTypes>(
  "gd_queue_invalid_video",
  ObdQueueErrorTypesSchema,
  "gd_queue_invalid_video"
);

export const ObdQueueTimeOutModel = mongoose.model<ObdQueueErrorTypes>(
  "gd_queue_timeout",
  ObdQueueErrorTypesSchema,
  "gd_queue_timeout"
);
