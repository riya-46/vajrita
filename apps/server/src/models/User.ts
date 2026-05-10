import mongoose, { Schema, type InferSchemaType } from "mongoose";

const fakeCallConfigSchema = new Schema(
  {
    defaultDelaySeconds: { type: Number, default: 20 },
    defaultCallerName: { type: String, default: "Emergency Contact" },
    defaultCallerPhone: { type: String, default: "+911234567890" },
    ringtoneUrl: { type: String },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    verified: { type: Boolean, default: true },
    trustedContactsCount: { type: Number, default: 0 },
    fakeCallConfig: { type: fakeCallConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
