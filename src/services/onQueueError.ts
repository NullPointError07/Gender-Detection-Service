import { ErrorTypes } from "../enums";
import { AiModelResponseFail } from "../models/aiModelResponseFail";
import {
  ObdQueueErrorModel,
  ObdQueueInvalidVideoModel,
  ObdQueueTimeOutModel,
} from "../models/obdQueueErrorTypesModel";
import { ObdQueue } from "../models/obdQueueModel";

/**
 * @description: "It takes status: 0 from Ai Model and creates document according to error_types in different collections"
 */
export async function onQueueError(oldestDocuemnt: ObdQueue, apiResponse: AiModelResponseFail) {
  const { _id, ...documentWithoutId } = oldestDocuemnt.toObject();

  const documentData = {
    ...documentWithoutId,
    video_processor_api_response: apiResponse,
  };

  const { error_type } = apiResponse;
  console.log(`| video processing error, type:${error_type}`);

  const errorTypeHandlers: Record<ErrorTypes, { model: any; message: string }> = {
    [ErrorTypes.INVALID_VIDEO]: {
      model: ObdQueueInvalidVideoModel,
      message: "video has been moved to 'invalid' collection",
    },
    [ErrorTypes.TIMEOUT]: {
      model: ObdQueueTimeOutModel,
      message: "video has been moved to 'timeout' collection",
    },
    [ErrorTypes.DOWNLOAD_FAILED]: {
      model: ObdQueueErrorModel,
      message: "video has been moved to 'error' collection",
    },
    [ErrorTypes.ERROR]: {
      model: ObdQueueErrorModel,
      message: "video has been moved to 'error' collection",
    },
  };

  try {
    const handler = errorTypeHandlers[error_type];

    if (handler) {
      console.log(`| ${error_type}:`, documentData);
      await handler.model.create(documentData);
      console.log(`| ${handler.message}`);
    } else {
      console.log("| Unknown error type:", error_type);
    }
  } catch (error) {
    console.log("| Failure to move Queue: From Queue to Timeout", error);
    console.log("+------- END -------+");
  }
}
