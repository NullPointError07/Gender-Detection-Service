import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";

export async function deleteFromObdCompleted(_id: any) {
  try {
    await ObdQueueCompletedModel.findByIdAndDelete(_id);
  } catch (error) {
    console.log("| Failed to delete from Obd Completed", error);
    console.log("+------- END -------+");
  }
}
