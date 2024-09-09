import mongoose from "mongoose";
import { ObdPublished, ObdPublishedSchema } from "./obdPublishedModel";

export const ObdPublishErrorModel = mongoose.model<ObdPublished>(
  "obd_publish_error",
  ObdPublishedSchema,
  "obd_publish_error"
);
