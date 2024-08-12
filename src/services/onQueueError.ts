import { ErrorTypes } from "../enums";
import { ApiResponseFail } from "../models/apiResponse";
import {
  GdQueueErrorModel,
  GdQueueInvalidVideoModel,
  GdQueueTimeOutModel,
} from "../models/gdQueueErrorTypesModel";
import { GdQueue } from "../models/gdQueueModel";
import { deleteFromGdQueue } from "../utils/deleteFromQueue";

export async function onQueueError(
  oldestDocuemnt: GdQueue,
  apiResponse: ApiResponseFail
) {
  const { _id, ...documentWithoutId } = oldestDocuemnt.toObject();

  const documentData = {
    ...documentWithoutId,
    video_processor_api_response: apiResponse,
  };

  const { error_type } = apiResponse;

  try {
    switch (error_type) {
      case ErrorTypes.TIMEOUT:
        await GdQueueTimeOutModel.create(documentData);
        break;
      case ErrorTypes.INVALID_VIDEO:
        await GdQueueInvalidVideoModel.create(documentData);
        break;
      case ErrorTypes.ERROR:
        await GdQueueErrorModel.create(documentData);
        break;
      default:
        console.error("Unknown error type:", error_type);
    }

    await deleteFromGdQueue(_id);
  } catch (error) {
    throw new Error("Failure to move Queue: From Queue to Timeout");
  }
}
