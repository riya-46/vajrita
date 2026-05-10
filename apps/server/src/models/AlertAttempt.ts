import mongoose, { Schema, type InferSchemaType } from "mongoose";

const alertAttemptSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "EmergencySession", required: true, index: true },
    channel: { type: String, enum: ["sms", "whatsapp", "call"], required: true },
    recipientPhone: { type: String, required: true },
    providerMessageId: { type: String, default: null },
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending", index: true },
    errorCode: { type: String, default: null },
  },
  { timestamps: true },
);

export type AlertAttemptDocument = InferSchemaType<typeof alertAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const AlertAttemptModel =
  mongoose.models.AlertAttempt || mongoose.model("AlertAttempt", alertAttemptSchema);
