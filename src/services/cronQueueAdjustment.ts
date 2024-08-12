import axios from "axios";
import { GdQueueModel } from "../models/gdQueueModel";

export async function cronQueueAdjustment() {
  const queueAdjustmentApi = `${process.env.FANFARE_URL}/gender-detection/fanfare-backend-gd-unqueued-presents`;

  const queryData = {
    created_date: "2023-08-08",
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

    console.log(documentToInsert.length);
  } catch (error) {
    throw new Error("Error fetching unqueued videos:" + error);
  }
}
