import axios from "axios";
import { onCompleteStatus } from "../enums";
import { GdQueueCompletedModel } from "../models/gdQueueCompletedModel";
import { updatePublishStatus } from "../utils/updatePublishStatus";
import { onGdPublishComplete } from "./onGdPublishComplete";
import { onGdPublishError } from "./onGdPublishError";
import { genderPublicationApi } from "../utils/apiUrls";

/**
 * @description: "This Function will publish a video to fanfare backend from Gd Service(GdCompleted)"
 */
export async function cronPublish() {
  console.log(`+------ GD PUBLISHER STARTED AT ${new Date()} --------+`);
  try {
    console.log("| Fetching oldest unpublished item");
    const oldestUnPublishedDoc = await GdQueueCompletedModel.findOne({
      publish_status: onCompleteStatus.UNPUBLISHED,
    });

    if (!oldestUnPublishedDoc) {
      console.log("+-------- No item to publish --------+\n\n\n");
      return "Oldest UnpublishedDocument Not Found. Database might be empty";
    }

    console.log("| Oldest unpublished item is fetched:", oldestUnPublishedDoc);

    console.log("| Updating publish_status to in_progress");
    await updatePublishStatus(oldestUnPublishedDoc?._id);
    console.log(
      "| Updated publish_status to in_progress, publisher is busy now"
    );

    const {
      present_id,
      max_person_count,
      male_percentage,
      female_percentage,
      total_frame_count,
      duration,
    } = oldestUnPublishedDoc;

    const publicationData = {
      present_id,
      max_person_count,
      male_percentage,
      female_percentage,
      total_frame_count,
      video_duration: duration,
    };

    console.log("| Invoking publication API", publicationData);

    const response = await axios.post(genderPublicationApi, publicationData);

    console.log("| Publication API sent output", response.data);

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

    console.log("+------ GD Publisher Complete --------+\n\n\n");
  } catch (error) {
    throw new Error("Cron Publish Failed");
  }
}
