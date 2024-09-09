import { ObdPublishApiResponse } from "../models/obdPublishApiResponse";
import { ObdPublishedModel } from "../models/obdPublishedModel";
import { ObdQueueCompleted } from "../models/obdQueueCompletedModel";
import { deleteFromObdCompleted } from "../utils/deleteFromObdCompleted";

/**
 * @description: "This Function will move from gd completed to gd published"
 */
export async function onObdPublishComplete(
  oldestUnPublishedDoc: ObdQueueCompleted,
  apiResponse: ObdPublishApiResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    gd_publisher_api_response: apiResponse,
  };

  console.log(`| Published gd-results, video-id:${documentData.present_id}`);

  try {
    await ObdPublishedModel.create(documentData);

    await deleteFromObdCompleted(_id);
    console.log(`| Video has been moved from gd-completed to gd-published`);
  } catch (error) {
    console.log(
      `| Failed to move video from gd-completed to gd-published`,
      error
    );
    console.log("+------- END -------+");
  }
}
