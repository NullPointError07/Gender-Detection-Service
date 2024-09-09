import mongoose, { Schema } from "mongoose";
import { QueueStatus } from "../enums";
import { SharedFields, SharedFieldsSchema } from "./sharedFields";

export interface ObdQueue extends SharedFields {
  q_status: QueueStatus;
}

const ObdQueueSchema: Schema = new Schema(
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

export const ObdQueueModel = mongoose.model<ObdQueue>(
  "gd_queue",
  ObdQueueSchema,
  "gd_queue"
);
