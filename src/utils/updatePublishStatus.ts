import { onCompleteStatus } from "../enums";
import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";

export async function updatePublishStatus(_id: any) {
  try {
    await GdQueueCompletedModel.findByIdAndUpdate(_id, {
      publish_status: onCompleteStatus.IN_PROGRESS,
    });
  } catch (error) {
    console.log("| Failed to update the published status");
    console.log("+------- END -------+");
  }
}
