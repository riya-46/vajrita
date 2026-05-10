import mongoose, { Schema, type InferSchemaType } from "mongoose";

const contactVerificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contactId: { type: Schema.Types.ObjectId, ref: "TrustedContact", required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type ContactVerificationDocument = InferSchemaType<typeof contactVerificationSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ContactVerificationModel =
  mongoose.models.ContactVerification ||
  mongoose.model("ContactVerification", contactVerificationSchema);
