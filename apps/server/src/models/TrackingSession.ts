import mongoose, { Schema, type InferSchemaType } from "mongoose";

const lastLocationSchema = new Schema(
  {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    speed: Number,
    heading: Number,
    timestamp: Date,
  },
  { _id: false },
);

const trackingSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    shareToken: { type: String, required: true, unique: true, index: true },
    active: { type: Boolean, default: true, index: true },
    duration: { type: String, enum: ["15m", "1h", "until_stopped"], required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null, index: true },
    lastLocation: { type: lastLocationSchema, default: null },
    recipients: [{ type: Schema.Types.ObjectId, ref: "TrustedContact" }],
  },
  { timestamps: true },
);

export type TrackingSessionDocument = InferSchemaType<typeof trackingSessionSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const TrackingSessionModel =
  mongoose.models.TrackingSession || mongoose.model("TrackingSession", trackingSessionSchema);
