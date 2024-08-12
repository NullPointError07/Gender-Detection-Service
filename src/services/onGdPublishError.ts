import { GdPublishErrorTypes } from "../enums";
import { GdPublishApiResponse } from "../models/gdPublishApiResponse";
import {
  GdPublishErrorModel,
  GdPublishTimeoutModel,
} from "../models/gdPublishErrorTypesModel";
import { GdQueueCompleted } from "../models/gdQueueCompletedModel";
import { deleteFromGdCompleted } from "../utils/deleteFromGdCompleted";

export async function onGdPublishError(
  oldestUnPublishedDoc: GdQueueCompleted,
  apiResponse: GdPublishApiResponse
) {
  const { _id, ...documentWithoutId } = oldestUnPublishedDoc.toObject();

  const documentData = {
    ...documentWithoutId,
    gd_publisher_api_response: apiResponse,
  };

  const { error_type } = apiResponse;

  try {
    if (error_type === GdPublishErrorTypes.TIMEOUT) {
      await GdPublishTimeoutModel.create(documentData);
    } else {
      await GdPublishErrorModel.create(documentData);
    }

    await deleteFromGdCompleted(_id);
  } catch (error) {
    throw new Error(
      "Failure to move from Gd Completed: From Gd Completed to GdPublishTimeout/GdPublishError"
    );
  }
}
