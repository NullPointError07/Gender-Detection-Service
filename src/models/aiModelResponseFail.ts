import { Schema } from "mongoose";
import { ErrorTypes } from "../enums";

export interface AiModelResponseFail {
  status: 0;
  error_type: ErrorTypes;
  details: string;
}

export const AiModelResponseFailSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    error_type: {
      type: String,
      enum: Object.values(ErrorTypes),
      required: true,
    },
    details: { type: String, required: true },
  },
  { _id: false }
);
