import { QueueStatus } from "../enums";
import { GdQueueModel } from "../models/gdQueueModel";

export async function updateQueueStatus(_id: any) {
  try {
    await GdQueueModel.findByIdAndUpdate(_id, {
      q_status: QueueStatus.IN_PROGRESS,
    });
  } catch (error) {
    throw new Error("Failed to update document status");
  }
}
