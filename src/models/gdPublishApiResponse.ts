import { Schema } from "mongoose";
import { GdPublishErrorTypes } from "../enums";

export interface GdPublishApiResponse {
  status: number;
  error_type?: GdPublishErrorTypes;
  msg: String;
}

export const GdPublishApiResponseSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    msg: { type: String, required: true },
  },
  { _id: false }
);
