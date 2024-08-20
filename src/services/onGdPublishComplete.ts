import { GdPublishApiResponse } from "../models/gdPublishApiResponse";
import { GdPublishedModel } from "../models/gdPublishedModel";
import { GdQueueCompleted } from "../models/gdQueueCompletedModel";
import { deleteFromGdCompleted } from "../utils/deleteFromGdCompleted";

/**
 * @description: "This Function will move from gd completed to gd published"
 */
export async function onGdPublishComplete(
  oldestUnPublishedDoc: GdQueueCompleted,
  apiResponse: GdPublishApiResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    gd_publisher_api_response: apiResponse,
  };

  console.log(`| Published gd-results, video-id:${documentData.present_id}`);

  try {
    await GdPublishedModel.create(documentData);

    await deleteFromGdCompleted(_id);
    console.log(`| Video has been moved from gd-completed to gd-published`);
  } catch (error) {
    console.log(`| Failed to move video from gd-completed to gd-published`);
    throw new Error(
      "Failure to move from Gd Completed: From Gd Completed to GdPublished"
    );
  }
}
