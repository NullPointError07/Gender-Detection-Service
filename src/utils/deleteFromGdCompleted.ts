import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";

export async function deleteFromGdCompleted(_id: any) {
  try {
    await GdQueueCompletedModel.findByIdAndDelete(_id);
  } catch (error) {
    console.log("| Failed to delete from Gd Completed", error);
    console.log("+------- END -------+");
  }
}
