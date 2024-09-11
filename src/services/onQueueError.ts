import { ErrorTypes } from "../enums";
import { AiModelResponseFail } from "../models/aiModelResponseFail";
import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";
import {
  ObdQueueErrorModel,
  ObdQueueInvalidVideoModel,
  ObdQueueTimeOutModel,
} from "../models/obdQueueErrorTypesModel";
import { ObdQueue } from "../models/obdQueueModel";
import { deleteFromObdQueue } from "../utils/deleteFromQueue";

/**
 * @description: "It takes status:0 from Ai Model and creates document according to error_types in different collections"
 */
export async function onQueueError(oldestDocuemnt: ObdQueue, apiResponse: AiModelResponseFail) {
  const { _id, ...documentWithoutId } = oldestDocuemnt.toObject();

  const documentData = {
    ...documentWithoutId,
    video_processor_api_response: apiResponse,
  };

  const { error_type } = apiResponse;
  console.log(`| video processing error, type:${error_type}`);

  try {
    switch (error_type) {
      case ErrorTypes.INVALID_VIDEO:
        console.log("invalid_video", documentData);
        await ObdQueueInvalidVideoModel.create(documentData);
        console.log("| video has been moved to 'invalid' collection");
        break;
      case ErrorTypes.TIMEOUT:
        console.log("timeout:", documentData);
        await ObdQueueTimeOutModel.create(documentData);
        console.log("| video has been moved to 'timeout' collection");
        break;
      case ErrorTypes.NO_OBJECT:
        console.log("no_object", documentData);
        await ObdQueueCompletedModel.create(documentData);
        console.log("| video has been moved to 'completed' collection");
        break;
      case ErrorTypes.DOWNLOAD_FAILED:
        console.log("download_failed", documentData);
        await ObdQueueErrorModel.create(documentData);
        console.log("| video has been moved to 'error' collection");
        break;
      case ErrorTypes.ERROR:
        console.log("general error", documentData);
        await ObdQueueErrorModel.create(documentData);
        console.log("| video has been moved to 'error' collection");
        break;
      default:
        console.log("| Unknown error type:", error_type);
    }

    await deleteFromObdQueue(_id);
  } catch (error) {
    console.log("| Failure to move Queue: From Queue to Timeout", error);
    console.log("+------- END -------+");
  }
}
