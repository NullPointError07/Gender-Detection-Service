import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";

export async function deleteFromGdCompleted(_id: any) {
  try {
    await GdQueueCompletedModel.findByIdAndDelete(_id);
  } catch (error) {
    throw new Error("Failed to delete from Gd Completed");
  }
}
