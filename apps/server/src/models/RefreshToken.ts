import mongoose, { Schema, type InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true },
    userAgent: { type: String },
    revokedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

export type RefreshTokenDocument = InferSchemaType<typeof refreshTokenSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const RefreshTokenModel =
  mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
