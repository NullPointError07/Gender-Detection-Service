import mongoose, { Schema } from "mongoose";
import { ApiResponseOk, ApiResponseOkSchema } from "./apiResponseOk";
import {
  ObdPublishApiResponse,
  ObdPublishApiResponseSchema,
} from "./obdPublishApiResponse";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface ObdPublished extends SharedFields {
  video_processor_api_response: ApiResponseOk;
  gd_publisher_api_response: ObdPublishApiResponse;
}

export const ObdPublishedSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    video_processor_api_response: {
      type: ApiResponseOkSchema,
      required: true,
    },
    gd_publisher_api_response: {
      type: ObdPublishApiResponseSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const ObdPublishedModel = mongoose.model<ObdPublished>(
  "gd_published",
  ObdPublishedSchema,
  "gd_published"
);
