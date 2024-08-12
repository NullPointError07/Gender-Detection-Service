import { GdQueueModel } from "../models/gdQueueModel";

export async function deleteFromGdQueue(_id: any) {
  try {
    await GdQueueModel.findByIdAndDelete(_id);
  } catch (error) {
    throw new Error("Failure to move Queue: At deleting from gdQueue");
  }
}
