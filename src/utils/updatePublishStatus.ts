import { onCompleteStatus } from "../enums";
import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";

export async function updatePublishStatus(_id: any) {
  try {
    await ObdQueueCompletedModel.findByIdAndUpdate(_id, {
      publish_status: onCompleteStatus.IN_PROGRESS,
    });
  } catch (error) {
    console.log("| Failed to update the published status");
    console.log("+------- END -------+");
  }
}
