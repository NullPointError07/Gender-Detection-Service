import { ObdQueueModel } from "../models/obdQueueModel";

export async function deleteFromObdQueue(_id: any) {
  try {
    await ObdQueueModel.findByIdAndDelete(_id);
  } catch (error) {
    console.log("| Failure to move Queue: At deleting from ObdQueue", error);
    console.log("+------- END -------+");
  }
}
