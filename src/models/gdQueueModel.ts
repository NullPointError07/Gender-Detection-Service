import mongoose, { Schema } from "mongoose";
import { QueueStatus } from "../enums";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface GdQueue extends SharedFields {
  q_status: QueueStatus;
}

const GdQueueSchema: Schema = new Schema(
  {
    ...SharedFieldsSchema.obj,
    q_status: {
      type: String,
      enum: Object.values(QueueStatus),
      default: QueueStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const GdQueueModel = mongoose.model<GdQueue>(
  "gd_queue",
  GdQueueSchema,
  "gd_queue"
);
