import { onCompleteStatus } from "../enums";
import { ApiResponseSuccess } from "../models/apiResponse";
import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";
import { GdQueue } from "../models/gdQueueModel";
import { deleteFromGdQueue } from "./deleteFromQueue";

export async function onComplete(
  oldestDocuemnt: GdQueue,
  apiResponse: ApiResponseSuccess
) {
  const { _id, present_id, s3_bucket_url, gp_cdn_url, cloud_front_url } =
    oldestDocuemnt;

  const {
    max_person_count,
    male_percentage,
    female_percentage,
    total_frame_count,
    video_duration,
  } = apiResponse.data;

  try {
    await GdQueueCompletedModel.create({
      present_id,
      s3_bucket_url,
      gp_cdn_url,
      cloud_front_url,
      video_processor_api_response: apiResponse,
      max_person_count,
      male_percentage,
      female_percentage,
      total_frame_count,
      video_duration,
      publish_status: onCompleteStatus.UNPUBLISHED,
    });

    await deleteFromGdQueue(_id);
  } catch (error) {
    throw new Error("Failure to move Queue: From Queue to Invalid Video");
  }
}
