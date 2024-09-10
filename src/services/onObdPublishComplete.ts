import { ObdPublisherResponse } from "../models/obdPublisherResponse";
import { ObdPublishedModel } from "../models/obdPublishedModel";
import { ObdQueueCompleted } from "../models/obdQueueCompletedModel";
import { deleteFromObdCompleted } from "../utils/deleteFromObdCompleted";

/**
 * @description: "This Function will move from obd completed to obd published"
 */
export async function onObdPublishComplete(
  oldestUnPublishedDoc: ObdQueueCompleted,
  apiResponse: ObdPublisherResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    obd_publisher_api_response: apiResponse,
  };

  console.log(`| Published obd-results, video-id:${documentData.present_id}`);

  try {
    await ObdPublishedModel.create(documentData);

    await deleteFromObdCompleted(_id);
    console.log(`| Video has been moved from obd-completed to obd-published`);
  } catch (error) {
    console.log(`| Failed to move video from obd-completed to obd-published`, error);
    console.log("+------- END -------+");
  }
}
