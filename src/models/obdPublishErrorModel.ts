import mongoose from "mongoose";
import { ObdPublished, ObdPublishedSchema } from "./obdPublishedModel";

export const ObdPublishErrorModel = mongoose.model<ObdPublished>(
  "gd_publish_error",
  ObdPublishedSchema,
  "gd_publish_error"
);
