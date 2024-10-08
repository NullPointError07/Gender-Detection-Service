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
export async function cronOutputPublisher() {
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

    console.log("| Gender Publication API: ", genderPublicationApi);
    console.log("| Invoking publication API with: ", publicationData);

    let response;
    try {
      response = await axios.post(genderPublicationApi, publicationData, {
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
        } else {
          response = {
            data: {
              status: 0,
              msg: "An unknown error type Occured",
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
    console.log("| Failure At Publishig Cron", error);
    console.log("+------- END -------+");
  }
}
