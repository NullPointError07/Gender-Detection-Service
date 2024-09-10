import { onCompleteStatus } from "../enums";
import { AiModelResponseOk } from "../models/aiModelResponseOk";
import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";
import { ObdQueue } from "../models/obdQueueModel";
import { deleteFromObdQueue } from "../utils/deleteFromQueue";

/**
 * @description: "This function move document from queue to obd complete collection"
 */
export async function onQueueComplete(oldestDocuemnt: ObdQueue, apiResponse: AiModelResponseOk) {
  console.log("about to complete....", apiResponse);

  const { _id, ...documentWithoutId } = oldestDocuemnt.toObject();

  const completedData = {
    ...documentWithoutId,
    video_processor_api_response: apiResponse,
    publish_status: onCompleteStatus.UNPUBLISHED,
  };

  console.log("completed data", completedData);

  try {
    await ObdQueueCompletedModel.create(completedData);

    await deleteFromObdQueue(_id);
  } catch (error) {
    console.log("| Failure to move Queue: From Queue to Invalid Video", error);
    console.log("+------- END -------+");
  }
}
