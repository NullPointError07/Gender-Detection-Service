import axios from "axios";
import { onCompleteStatus } from "../enums";
import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";
import { updatePublishStatus } from "../utils/updatePublishStatus";
import { onGdPublishComplete } from "./onGdPublishComplete";
import { onGdPublishError } from "./onGdPublishError";
import { fanfareBackendApi } from "../utils/apiUrls";

/**
 * @description: "This Function will publish a video to fanfare backend from Gd Service(GdCompleted)"
 */
export async function cronPublish() {
  try {
    const oldestUnPublishedDoc = await GdQueueCompletedModel.findOne({
      publish_status: onCompleteStatus.UNPUBLISHED,
    });

    if (!oldestUnPublishedDoc) {
      return "Oldest UnpublishedDocument Not Found. Database might be empty";
    }

    await updatePublishStatus(oldestUnPublishedDoc?._id);

    const response = await axios.post(fanfareBackendApi, oldestUnPublishedDoc);

    console.log("Response from /mock-fanfare:", response.data);

    switch (response.data.status) {
      case 0:
        await onGdPublishError(oldestUnPublishedDoc, response.data);
        break;
      case 1:
        await onGdPublishComplete(oldestUnPublishedDoc, response.data);
        break;
      default:
        console.error("Unknown status type:", response.data.status);
    }
  } catch (error) {
    throw new Error("Cron Publish Failed");
  }
}
