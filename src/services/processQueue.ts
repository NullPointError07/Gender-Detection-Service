import express from "express";
import axios from "axios";
import { GdQueueModel } from "../models/gdQueueModel";
import { onTimeout } from "./onTimeout";
import { onInvalidVideo } from "./onInvalidVideo";
import { onGeneralError } from "./onGeneralError";
import { ErrorTypes } from "../enums";
import { onComplete } from "./onComplete";

export async function processQueue() {
  try {
    const oldestDocuemnt = await GdQueueModel.findOne().exec();

    if (!oldestDocuemnt) {
      // return res
      //   .status(404)
      //   .json({ message: "Cannot find any document, Collection Is Empty" });
      return "Cannot find any document, Collection Is Empty";
    }

    const genderDetectionApi = `${process.env.BASE_URL}/mock-test`;

    const response = await axios.post(genderDetectionApi, oldestDocuemnt);

    console.log("Response from /mock-test:", response.data);

    switch (response.data.status) {
      case 0:
        switch (response.data.error_type) {
          case ErrorTypes.TIMEOUT:
            await onTimeout(oldestDocuemnt, response.data);
            break;
          case ErrorTypes.INVALID_VIDEO:
            await onInvalidVideo(oldestDocuemnt, response.data);
            break;
          case ErrorTypes.ERROR:
            await onGeneralError(oldestDocuemnt, response.data);
            break;
          default:
            console.error("Unknown error type:", response.data.error_type);
        }
        break;
      case 1:
        await onComplete(oldestDocuemnt, response.data);
        break;
      default:
        console.error("Unknown status type:", response.data.status);
    }

    await processQueue();

    // res
    //   .status(200)
    //   .json({ data: oldestDocuemnt, message: "Data sent successfully" });
  } catch (error) {
    // res.status(500).json({
    //   message: "Error fetching oldest document",
    //   error: (error as Error).message,
    // });
    // then also again after error
  }
}
