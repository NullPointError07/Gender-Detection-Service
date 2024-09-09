import { Schema } from "mongoose";

export interface ApiResponseOk {
  status: 1;
  data: {
    max_counts: Record<string, number>;
    total_frame_count: number;
    frame_rate: number;
    duration: string;
    processed_frame_count: number;
  };
}

export const ApiResponseOkSchema: Schema = new Schema(
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
