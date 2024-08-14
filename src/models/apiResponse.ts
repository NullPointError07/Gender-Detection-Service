import { Schema } from "mongoose";
import { ErrorTypes } from "../enums";

export interface ApiResponseSuccess {
  status: number;
  data: {
    max_person_count: number;
    male_percentage: number;
    female_percentage: number;
    total_frame_count: number;
    frame_rate: string;
    duration: string;
  };
}

export interface ApiResponseFail {
  status: number;
  error_type: ErrorTypes;
  detail: string;
}

export const ApiResponseSuccessSchema: Schema = new Schema(
  {
    status: { type: Number, required: true },
    data: {
      type: new Schema(
        {
          max_person_count: { type: Number, required: true },
          male_percentage: { type: Number, required: true },
          female_percentage: { type: Number, required: true },
          total_frame_count: { type: Number, required: true },
          frame_rate: { type: Number, required: true },
          duration: { type: String, required: true },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
);

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
