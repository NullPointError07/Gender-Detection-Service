import { Schema } from "mongoose";
import { ErrorTypes } from "../enums";

export interface ApiResponseFail {
  status: 0;
  error_type: ErrorTypes;
  detail: string;
}

export const ApiResponseFailSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    error_type: {
      type: String,
      enum: Object.values(ErrorTypes),
      required: true,
    },
    detail: { type: String, required: true },
  },
  { _id: false }
);
