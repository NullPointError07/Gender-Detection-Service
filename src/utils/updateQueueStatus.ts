import { QueueStatus } from "../enums";
import { ObdQueueModel } from "../models/obdQueueModel";

export async function updateQueueStatus(_id: any) {
  try {
    await ObdQueueModel.findByIdAndUpdate(_id, {
      q_status: QueueStatus.IN_PROGRESS,
    });
  } catch (error) {
    console.log("| Failed to update queue status", error);
    console.log("+------- END -------+");
  }
}
