import mongoose, { Schema } from "mongoose";
import { AiModelResponseFail, AiModelResponseFailSchema } from "./aiModelResponseFail";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

interface ObdQueueErrorTypes extends SharedFields {
  video_processor_api_response: AiModelResponseFail;
}

const ObdQueueErrorTypesSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: AiModelResponseFailSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const ObdQueueErrorModel = mongoose.model<ObdQueueErrorTypes>(
  "obd_queue_error",
  ObdQueueErrorTypesSchema,
  "obd_queue_error"
);

export const ObdQueueInvalidVideoModel = mongoose.model<ObdQueueErrorTypes>(
  "obd_queue_invalid_video",
  ObdQueueErrorTypesSchema,
  "obd_queue_invalid_video"
);

export const ObdQueueTimeOutModel = mongoose.model<ObdQueueErrorTypes>(
  "obd_queue_timeout",
  ObdQueueErrorTypesSchema,
  "obd_queue_timeout"
);
