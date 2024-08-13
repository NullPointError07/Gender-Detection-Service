import axios from "axios";
import { GdQueueModel } from "../models/gdQueueModel";
import { queueAdjustmentApi, updateUnqueudPresentsApi } from "../utils/apiUrls";

/**
 * @description: "This Function will do a cron job to set every unqueued video from backend and set the video in the queue"
 */
export async function cronQueueAdjustment() {
  const queryData = {
    created_date: "2023-08-08", // this should be new date but new date data isnt available enough
  };

  try {
    const response = await axios.get(queueAdjustmentApi, {
      data: queryData,
    });

    // console.log(response);

    const unqueuedVideos = response?.data?.data;

    const documentToInsert = unqueuedVideos.map((video: any) => ({
      present_id: video.present_id,
      s3_bucket_url: video.s3_bucket_url,
      gp_cdn_url: video.gp_cdn_url,
      cloud_front_url: video.cloud_front_url,
      createdAt: new Date(video.created_at),
      updatedAt: new Date(video.created_at),
    }));

    console.log(documentToInsert);

    await GdQueueModel.insertMany(documentToInsert);

    const presentIdsToSubmit = unqueuedVideos.map(
      (video: any) => video.present_id
    );

    await axios.post(updateUnqueudPresentsApi, presentIdsToSubmit);

    console.log("ids to submit", presentIdsToSubmit);

    console.log(documentToInsert.length);
  } catch (error) {
    throw new Error("Error fetching unqueued videos:" + error);
  }
}
