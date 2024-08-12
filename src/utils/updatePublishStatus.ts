import { onCompleteStatus } from "../enums";
import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";

export async function updatePublishStatus(_id: any) {
  try {
    await GdQueueCompletedModel.findByIdAndUpdate(_id, {
      publish_status: onCompleteStatus.IN_PROGRESS,
    });
  } catch (error) {
    throw new Error("Failed to update the published status");
  }
}
