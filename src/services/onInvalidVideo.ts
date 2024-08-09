import { ApiResponseFail } from "../models/apiResponse";
import { GdQueueInvalidVideoModel } from "../models/gdQueueInvalidVideoModel";
import { GdQueue } from "../models/gdQueueModel";
import { deleteFromGdQueue } from "./deleteFromQueue";

export async function onInvalidVideo(
  oldestDocuemnt: GdQueue,
  apiResponse: ApiResponseFail
) {
  const { _id, present_id, s3_bucket_url, gp_cdn_url, cloud_front_url } =
    oldestDocuemnt;

  try {
    await GdQueueInvalidVideoModel.create({
      present_id,
      s3_bucket_url,
      gp_cdn_url,
      cloud_front_url,
      video_processor_api_response: apiResponse,
    });

    await deleteFromGdQueue(_id);
  } catch (error) {
    throw new Error("Failure to move Queue: From Queue to Invalid Video");
  }
}
