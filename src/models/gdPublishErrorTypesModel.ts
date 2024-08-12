import mongoose from "mongoose";
import { GdPublished, GdPublishedSchema } from "./gdPublishedModel";

export const GdPublishErrorModel = mongoose.model<GdPublished>(
  "gd_publish_error",
  GdPublishedSchema
);

export const GdPublishTimeoutModel = mongoose.model<GdPublished>(
  "gd_publish_timeout",
  GdPublishedSchema
);
