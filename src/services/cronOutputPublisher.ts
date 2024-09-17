import axios from "axios";
import { onCompleteStatus } from "../enums";
import { objectPublicationApi } from "../utils/apiUrls";
import { onObdPublishError } from "./onObdPublishError";
import { onObdPublishComplete } from "./onObdPublishComplete";
import { updatePublishStatus } from "../utils/updatePublishStatus";
import { ObdQueueCompletedModel } from "../models/obdQueueCompletedModel";
import { deleteFromObdCompleted } from "../utils/deleteFromObdCompleted";

/**
 * @description: "This Function will publish a video to fanfare backend from OBD Service(OBDCompleted)"
 */
export async function cronOutputPublisher() {
  console.log(`+------ OBD PUBLISHER STARTED AT ${new Date()} --------+`);
  try {
    console.log("| Fetching oldest unpublished item");
    const oldestUnPublishedDoc = await ObdQueueCompletedModel.findOne({
      publish_status: onCompleteStatus.UNPUBLISHED,
    });

    if (!oldestUnPublishedDoc) {
      console.log("+-------- No item to publish --------+\n\n\n");
      return "Oldest UnpublishedDocument Not Found. Database might be empty";
    }

    console.log("| Oldest unpublished item is fetched:", oldestUnPublishedDoc);

    console.log("| Updating publish_status to in_progress");
    await updatePublishStatus(oldestUnPublishedDoc?._id);
    console.log("| Updated publish_status to in_progress, publisher is busy now");

    const { _id, present_id, video_processor_api_response } = oldestUnPublishedDoc;

    const publicationData = { present_id, data: video_processor_api_response?.data };

    console.log("| Object Publication API: ", objectPublicationApi);
    console.log("| Invoking publication API with: ", publicationData);

    let response;
    try {
      response = await axios.post(objectPublicationApi, publicationData, {
        timeout: 50000,
      });
      console.log("| Publication API sent output: ", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          response = {
            data: {
              status: 0,
              msg: "ECONNREFUSED",
            },
          };
        } else if (error.code === "ECONNABORTED") {
          response = {
            data: {
              status: 0,
              msg: "ECONNABORTED",
            },
          };
        }
      } else {
        response = {
          data: {
            status: 0,
            msg: "An unknown error type Occured",
          },
        };
      }
    }

    switch (response?.data.status) {
      case 0:
        await onObdPublishError(oldestUnPublishedDoc, response.data);
        break;
      case 1:
        await onObdPublishComplete(oldestUnPublishedDoc, response.data);
        break;
      default:
        console.error("Unknown status type:", response?.data.status);
    }

    await deleteFromObdCompleted(_id);
    console.log("+------ OBD Publisher Complete --------+\n\n\n");
  } catch (error) {
    console.log("| Failure At Publishig Cron", error);
    console.log("+------- END -------+");
  }
}
