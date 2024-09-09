import { Schema } from "mongoose";

export interface ObdPublishApiResponse {
  status: 0 | 1;
  msg: String;
}

export const ObdPublishApiResponseSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    msg: { type: String, required: true },
  },
  { _id: false }
);
