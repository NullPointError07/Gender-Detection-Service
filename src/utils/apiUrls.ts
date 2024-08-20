export const genderDetectionApi: string =
  process.env.GENDER_DETECTION_API_URL ?? "";
export const genderPublicationApi: string =
  process.env.GD_PUBLICATION_API_URL ?? "";
export const queueAdjustmentApi = process.env.QUEUE_ADJUSTMENT_API_URL ?? "";
export const updateUnqueudPresentsApi =
  process.env.QUEUE_ADJUSTMENT_ACKNOWLEDGEMENT_API_URL ?? "";
