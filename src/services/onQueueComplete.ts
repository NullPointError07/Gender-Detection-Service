import { onCompleteStatus } from "../enums";
import { ApiResponseOk } from "../models/apiResponseOk";
import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";
import { ObdQueue } from "../models/obdQueueModel";
import { deleteFromObdQueue } from "../utils/deleteFromQueue";

/**
 * @description: "This function move document from queue to gd complete collection"
 */
export async function onQueueComplete(
  oldestDocuemnt: ObdQueue,
  apiResponse: ApiResponseOk
) {
  console.log("about to complete....", apiResponse);

  const { _id, present_id, s3_bucket_url, gp_cdn_url, cloud_front_url } =
    oldestDocuemnt;

  const { total_frame_count, frame_rate, duration } = apiResponse.data;

  try {
    await ObdQueueCompletedModel.create({
      present_id,
      s3_bucket_url,
      gp_cdn_url,
      cloud_front_url,
      video_processor_api_response: apiResponse,
      total_frame_count,
      frame_rate,
      duration,
      publish_status: onCompleteStatus.UNPUBLISHED,
    });

    await deleteFromObdQueue(_id);
  } catch (error) {
    console.log("| Failure to move Queue: From Queue to Invalid Video", error);
    console.log("+------- END -------+");
  }
}
