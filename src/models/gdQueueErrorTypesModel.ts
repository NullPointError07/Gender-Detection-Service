import mongoose, { Schema } from "mongoose";
import { ApiResponseFail, ApiResponseFailSchema } from "./apiResponse";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

interface GdQueueErrorTypes extends SharedFields {
  video_processor_api_response: ApiResponseFail;
}

const GdQueueErrorTypesSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: ApiResponseFailSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const GdQueueErrorModel = mongoose.model<GdQueueErrorTypes>(
  "gd_queue_error",
  GdQueueErrorTypesSchema,
  "gd_queue_error"
);

export const GdQueueInvalidVideoModel = mongoose.model<GdQueueErrorTypes>(
  "gd_queue_invalid_video",
  GdQueueErrorTypesSchema,
  "gd_queue_invalid_video"
);

export const GdQueueTimeOutModel = mongoose.model<GdQueueErrorTypes>(
  "gd_queue_timeout",
  GdQueueErrorTypesSchema,
  "gd_queue_timeout"
);
