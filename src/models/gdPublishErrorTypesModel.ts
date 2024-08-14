import mongoose from "mongoose";
import { GdPublished, GdPublishedSchema } from "./gdPublishedModel";

export const GdPublishErrorModel = mongoose.model<GdPublished>(
  "gd_publish_error",
  GdPublishedSchema,
  "gd_publish_error"
);

export const GdPublishTimeoutModel = mongoose.model<GdPublished>(
  "gd_publish_timeout",
  GdPublishedSchema,
  "gd_publish_timeout"
);
