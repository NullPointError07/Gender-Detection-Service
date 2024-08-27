import { error } from "console";
import { ErrorTypes } from "../enums";
import { ApiResponseFail } from "../models/apiResponse";
import {
  GdQueueErrorModel,
  GdQueueInvalidVideoModel,
  GdQueueTimeOutModel,
} from "../models/gdQueueErrorTypesModel";
import { GdQueue } from "../models/gdQueueModel";
import { deleteFromGdQueue } from "../utils/deleteFromQueue";

/**
 * @description: "This Function will handle error types and create error document in error collection according to type"
 */
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
  console.log(`| video processing error, type:${error_type}`);
  console.log(`defined as :${ErrorTypes.INVALID_VIDEO}`);

  try {
    switch (error_type) {
      case ErrorTypes.TIMEOUT:
        console.log("timeout:", documentData);
        await GdQueueTimeOutModel.create(documentData);
        console.log("| video has been moved to 'timeout' collection");
        break;
      case ErrorTypes.INVALID_VIDEO:
        console.log("here....", documentData);
        await GdQueueInvalidVideoModel.create(documentData);
        console.log("| video has been moved to 'invalid' collection");
        break;
      case ErrorTypes.ERROR:
        await GdQueueErrorModel.create(documentData);
        console.log("| video has been moved to 'error' collection");
        break;
      default:
        console.log("| Unknown error type:", error_type);
    }

    await deleteFromGdQueue(_id);
  } catch (error) {
    console.log("| Failure to move Queue: From Queue to Timeout", error);
    console.log("+------- END -------+");
  }
}
