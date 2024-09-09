import { ObdPublishApiResponse } from "../models/obdPublishApiResponse";
import { ObdPublishErrorModel } from "../models/obdPublishErrorModel";
import { ObdQueueCompleted } from "../models/obdQueueCompletedModel";
import { deleteFromObdCompleted } from "../utils/deleteFromObdCompleted";

/**
 * @description: "This Function will handle error types and create error document in error collection according to type"
 */
export async function onObdPublishError(
  oldestUnPublishedDoc: ObdQueueCompleted,
  apiResponse: ObdPublishApiResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    obd_publisher_api_response: apiResponse,
  };

  try {
    await ObdPublishErrorModel.create(documentData);

    await deleteFromObdCompleted(_id);
  } catch (error) {
    console.log(
      "| Failure to move from Gd Completed: From Gd Completed to GdPublishTimeout/GdPublishError",
      error
    );
    console.log("+------- END -------+");
  }
}
