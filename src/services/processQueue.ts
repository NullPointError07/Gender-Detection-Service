import axios from "axios";
import express from "express";
import { GdQueueModel } from "../models/gdQueueModel";
import { onQueueComplete } from "./onQueueComplete";
import { updateQueueStatus } from "../utils/updateQueueStatus";
import { onQueueError } from "./onQueueError";
import { genderDetectionApi } from "../utils/apiUrls";

/**
 * @description: "This function will process the video send request in ai model and save the response according response status"
 */
export async function processQueue() {
  try {
    console.log(
      `+------------------ QUEUE PROCESSOR STARTED AT ${new Date()} ----------------------+`
    );
    console.log("| Fetching oldest item in gd-queue");
    const oldestDocuemnt = await GdQueueModel.findOne().exec();

    if (!oldestDocuemnt) {
      // return res
      //   .status(404)
      //   .json({ message: "Cannot find any document, Collection Is Empty" });
      console.log("+--------- gd-queue empty, terminating process ---------+");
      return "Cannot find any document, Collection Is Empty";
    }

    console.log("| Oldest item has been fetched from gd-queue");
    console.log("oldes doc", oldestDocuemnt);

    console.log("| Updating q_status to 'in-progress'");
    await updateQueueStatus(oldestDocuemnt._id);
    console.log("| q_status updated, processor is busy now");

    console.log("| Invoking gd-micro-service-video-processor API");
    let response;
    try {
      response = await axios.post(
        genderDetectionApi,
        {
          url: oldestDocuemnt?.s3_bucket_url,
        },
        {
          timeout: 300000,
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
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
        throw new Error("An unexpected axios error occured");
      }
    }

    console.log(
      "| gd-micro-service-video-processor sent output",
      response?.data
    );

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

    //dispatch event

    // res
    //   .status(200)
    //   .json({
    //     data: oldestDocuemnt,
    //     result: response.data,
    //     message: "Processor Is Completed",
    //   });
  } catch (error) {
    // res.status(500).json({
    //   message: "Error fetching oldest document",
    //   error: (error as Error).message,
    // });
    // then also again after error
  }
}
