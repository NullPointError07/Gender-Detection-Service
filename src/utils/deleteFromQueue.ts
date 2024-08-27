import { GdQueueModel } from "../models/gdQueueModel";

export async function deleteFromGdQueue(_id: any) {
  try {
    await GdQueueModel.findByIdAndDelete(_id);
  } catch (error) {
    console.log("| Failure to move Queue: At deleting from gdQueue", error);
    console.log("+------- END -------+");
  }
}
