import { ErrorTypes } from "../enums";
import { AiModelResponseFail } from "../models/aiModelResponseFail";
import {
  ObdQueueErrorModel,
  ObdQueueInvalidVideoModel,
  ObdQueueTimeOutModel,
} from "../models/obdQueueErrorTypesModel";
import { ObdQueue } from "../models/obdQueueModel";
import { deleteFromObdQueue } from "../utils/deleteFromQueue";

/**
 * @description: "This Function will handle error types and create error document in error collection according to type"
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
      case ErrorTypes.TIMEOUT:
        console.log("timeout:", documentData);
        await ObdQueueTimeOutModel.create(documentData);
        console.log("| video has been moved to 'timeout' collection");
        break;
      case ErrorTypes.INVALID_VIDEO:
        console.log("here....", documentData);
        await ObdQueueInvalidVideoModel.create(documentData);
        console.log("| video has been moved to 'invalid' collection");
        break;
      case ErrorTypes.ERROR:
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
