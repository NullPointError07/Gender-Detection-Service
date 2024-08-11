import { Schema } from "mongoose";

export interface GdPublishApiResponse {
  status: number;
  msg: String;
}

export const GdPublishApiResponseSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    msg: { type: String, required: true },
  },
  { _id: false }
);
