import mongoose, { Schema, type InferSchemaType } from "mongoose";

const locationPointSchema = new Schema(
  {
    trackingSessionId: { type: Schema.Types.ObjectId, ref: "TrackingSession", required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    speed: { type: Number },
    heading: { type: Number },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true },
);

export type LocationPointDocument = InferSchemaType<typeof locationPointSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const LocationPointModel =
  mongoose.models.LocationPoint || mongoose.model("LocationPoint", locationPointSchema);
