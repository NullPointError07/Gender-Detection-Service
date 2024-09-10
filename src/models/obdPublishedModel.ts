import mongoose, { Schema } from "mongoose";
import { AiModelResponseOk, AiModelResponseOkSchema } from "./aiModelResponseOk";
import { ObdPublisherResponse, ObdPublisherResponseSchema } from "./obdPublisherResponse";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface ObdPublished extends SharedFields {
  video_processor_api_response: AiModelResponseOk;
  obd_publisher_api_response: ObdPublisherResponse;
}

export const ObdPublishedSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: { type: AiModelResponseOkSchema, required: true },
    obd_publisher_api_response: { type: ObdPublisherResponseSchema, required: true },
  },
  { timestamps: true }
);

export const ObdPublishedModel = mongoose.model<ObdPublished>(
  "obd_published",
  ObdPublishedSchema,
  "obd_published"
);
