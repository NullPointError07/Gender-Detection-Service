import axios from "axios";
import { ObdQueueModel } from "../models/obdQueueModel";
import { onQueueComplete } from "./onQueueComplete";
import { updateQueueStatus } from "../utils/updateQueueStatus";
import { onQueueError } from "./onQueueError";
import { objectDetectionApi } from "../utils/apiUrls";

/**
 * @description: "This function will process the video send request in ai model and save the response according response status"
 */
export async function processQueue() {
  try {
    console.log(`+------------------ QUEUE PROCESSOR STARTED AT ${new Date()} ----------------------+`);
    console.log("| Fetching oldest item in obd-queue");
    const oldestDocuemnt = await ObdQueueModel.findOne({ q_status: "pending" }).exec();

    if (!oldestDocuemnt) {
      console.log("+--------- obd-queue empty, terminating process ---------+");
      return "Cannot find any document, Collection Is Empty";
    }

    console.log("| Oldest item has been fetched from obd-queue");
    console.log("oldes doc", oldestDocuemnt);

    const { _id, s3_bucket_url, gp_cdn_url } = oldestDocuemnt;

    console.log("| Updating q_status to 'in-progress'");
    await updateQueueStatus(_id);
    console.log("| q_status updated, processor is busy now");

    let response;
    let videoUrl = process.env.USE_GP_CDN == "yes" ? gp_cdn_url : s3_bucket_url;

    console.log("| Invoking obd-micro-service-video-processor API");
    console.log(`| => API URL: ${objectDetectionApi}`);
    console.log(`| => Video URL: ${videoUrl}`);

    try {
      response = await axios.post(objectDetectionApi, { url: videoUrl });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("| What is the type of Axios Error", error.code);
        if (error.code === "ECONNABORTED") {
          response = {
            data: {
              status: 0,
              error_type: "timeout",
              detail: "ECONNABORTED",
            },
          };
        } else if (error.code === "ECONNREFUSED") {
          response = {
            data: {
              status: 0,
              error_type: "timeout",
              detail: "ECONNREFUSED",
            },
          };
        }
      } else {
        console.log("| An unexpected axios error occured");
      }
    }

    console.log("| Response from Object Detection Model", response?.data);

    switch (response?.data.status) {
      case 0:
        await onQueueError(oldestDocuemnt, response?.data);
        break;
      case 1:
        await onQueueComplete(oldestDocuemnt, response?.data);
        break;
      default:
        console.error("Unknown status type:", response?.data.status);
    }

    console.log("+-------------- Processing Complete -----------+\n\n\n\n");
  } catch (error) {
    console.log("| An Error Occured At Process Queue", error);
    console.log("+------- END -------+");
  }
}
