import mongoose, { Schema, type InferSchemaType } from "mongoose";

const trustedContactSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
    verified: { type: Boolean, default: false, index: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

trustedContactSchema.index({ userId: 1, phone: 1 }, { unique: true });

export type TrustedContactDocument = InferSchemaType<typeof trustedContactSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const TrustedContactModel =
  mongoose.models.TrustedContact || mongoose.model("TrustedContact", trustedContactSchema);
