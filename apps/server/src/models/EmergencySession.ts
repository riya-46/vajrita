import mongoose, { Schema, type InferSchemaType } from "mongoose";

const recipientSchema = new Schema(
  {
    contactId: { type: Schema.Types.ObjectId, ref: "TrustedContact", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
  },
  { _id: false },
);

const emergencySessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    active: { type: Boolean, default: true, index: true },
    recipients: { type: [recipientSchema], default: [] },
    channels: [{ type: String, enum: ["sms", "whatsapp", "call"], required: true }],
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, default: null },
    liveTrackingEnabled: { type: Boolean, default: true },
    trackingSessionId: { type: Schema.Types.ObjectId, ref: "TrackingSession", default: null },
  },
  { timestamps: true },
);

export type EmergencySessionDocument = InferSchemaType<typeof emergencySessionSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const EmergencySessionModel =
  mongoose.models.EmergencySession || mongoose.model("EmergencySession", emergencySessionSchema);
