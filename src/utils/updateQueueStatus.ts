import { QueueStatus } from "../enums";
import { GdQueueModel } from "../models/gdQueueModel";

export async function updateQueueStatus(_id: any) {
  try {
    await GdQueueModel.findByIdAndUpdate(_id, {
      q_status: QueueStatus.IN_PROGRESS,
    });
  } catch (error) {
    console.log("| Failed to update queue status", error);
    console.log("+------- END -------+");
  }
}
