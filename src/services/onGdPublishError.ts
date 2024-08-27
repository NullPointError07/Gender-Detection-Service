import { GdPublishApiResponse } from "../models/gdPublishApiResponse";
import { GdPublishErrorModel } from "../models/gdPublishErrorModel";
import { GdQueueCompleted } from "../models/gdQueueCompletedModel";
import { deleteFromGdCompleted } from "../utils/deleteFromGdCompleted";

/**
 * @description: "This Function will handle error types and create error document in error collection according to type"
 */
export async function onGdPublishError(
  oldestUnPublishedDoc: GdQueueCompleted,
  apiResponse: GdPublishApiResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    gd_publisher_api_response: apiResponse,
  };

  try {
    await GdPublishErrorModel.create(documentData);

    await deleteFromGdCompleted(_id);
  } catch (error) {
    console.log(
      "| Failure to move from Gd Completed: From Gd Completed to GdPublishTimeout/GdPublishError",
      error
    );
    console.log("+------- END -------+");
  }
}
