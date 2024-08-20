import axios from "axios";
import { GdQueueModel } from "../models/gdQueueModel";
import { queueAdjustmentApi, updateUnqueudPresentsApi } from "../utils/apiUrls";
import { timeout } from "cron";

/**
 * @description: "This Function will do a cron job to set every unqueued video from backend and set the video in the queue"
 */
export async function cronQueueAdjustment() {
  console.log(`+---------- QUEUE ADJUSTMENT INITIATED AT ${new Date()} ----------+`);
  const queryData = {
    created_date: "2024-08-19", // this should be new date but new date data isnt available enough
  };
  console.log(`| Adjustment will take place for: ${queryData.created_date}`);

  try {
    // fetch unqueued-items from fanfare-backend
    let response;
    try{
      response = await axios.get(queueAdjustmentApi, 
        {data: queryData,timeout: 30*1000}
      );
    }catch (error: unknown) {
      console.log("| Couldn't send queue-adjustment request to fanfare-backend, ",error.code);
    }


    const unqueuedVideos = response?.data?.data;
    if(unqueuedVideos.length === 0 ){
      console.log("No items found for queue-adjustment, terminating process");
      console.log("+------- END -------+");
      return;
    }

    console.log("| Following items will be added to gd-queue: ",unqueuedVideos);

    // prepare document for insertion
    const documentToInsert = unqueuedVideos.map((video: any) => ({
      present_id: video.present_id,
      s3_bucket_url: video.s3_bucket_url,
      gp_cdn_url: video.gp_cdn_url,
      cloud_front_url: video.cloud_front_url,
      createdAt: new Date(video.created_at),
      updatedAt: new Date(video.created_at),
    }));

    // insert to gd-queue
    await GdQueueModel.insertMany(documentToInsert);

    console.log(`| gd-queue has been populated with ${documentToInsert.length} new items`);

    // prepare acknowledgement data for fanfare-backend
    const presentIdsToSubmit = unqueuedVideos.map(
      (video: any) => video.present_id
    );
    const queueAcknowledegmentData = {
      "present_ids":presentIdsToSubmit
    };

    console.log("| Sending queued-item-list to fanfare-backend: ", queueAcknowledegmentData);

    // acknowledge queue-adjustment to fanfare-backend
    try{         
      await axios.post(updateUnqueudPresentsApi, queueAcknowledegmentData);
      console.log("| Queue adjustment complete, terminating now");
    }catch (error: unknown) {
      console.log("| Couldn't acknowledge queue-adjustment to fanfare-backend, ", error.code);
    }
    console.log("+------- END -------+")

  } catch (error: unknown) {
    console.log("| Couldn't complete queue-adjustment, ", error.message);
    console.log("+------- END -------+")
    //throw new Error("Error fetching unqueued videos:" + error);
  }
}
