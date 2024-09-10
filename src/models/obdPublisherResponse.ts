import { Schema } from "mongoose";

export interface ObdPublisherResponse {
  status: 0 | 1;
  msg: String;
}

export const ObdPublisherResponseSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    msg: { type: String, required: true },
  },
  { _id: false }
);
