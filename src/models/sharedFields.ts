import mongoose, { Schema, Document } from "mongoose";

export interface SharedFields extends Document {
  present_id: mongoose.Types.ObjectId;
  s3_bucket_url: string;
  gp_cdn_url: string;
  cloud_front_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SharedFieldsSchema: Schema = new Schema({
  present_id: { type: Schema.Types.ObjectId, required: true, unique: true },
  s3_bucket_url: { type: String, required: true },
  gp_cdn_url: { type: String, required: true },
  cloud_front_url: { type: String, required: true },
});
