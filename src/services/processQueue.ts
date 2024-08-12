import axios from "axios";
import { GdQueueModel } from "../models/gdQueueModel";
import { onQueueComplete } from "./onQueueComplete";
import { updateQueueStatus } from "../utils/updateQueueStatus";
import { onQueueError } from "./onQueueError";

export async function processQueue() {
  try {
    const oldestDocuemnt = await GdQueueModel.findOne().exec();

    if (!oldestDocuemnt) {
      // return res
      //   .status(404)
      //   .json({ message: "Cannot find any document, Collection Is Empty" });
      return "Cannot find any document, Collection Is Empty";
    }

    await updateQueueStatus(oldestDocuemnt._id);

    const genderDetectionApi = `${process.env.BASE_URL}/mock-ai`;

    const response = await axios.post(genderDetectionApi, oldestDocuemnt);

    console.log("Response from /mock-test:", response.data);

    switch (response.data.status) {
      case 0:
        await onQueueError(oldestDocuemnt, response.data);
        break;
      case 1:
        await onQueueComplete(oldestDocuemnt, response.data);
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
