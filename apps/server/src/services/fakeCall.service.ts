import type { FakeCallConfigInput } from "@vajrita/shared";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

function toConfigDto(user: Awaited<ReturnType<typeof UserModel.findById>>) {
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return {
    defaultDelaySeconds: user.fakeCallConfig?.defaultDelaySeconds ?? 20,
    defaultCallerName: user.fakeCallConfig?.defaultCallerName ?? "Emergency Contact",
    defaultCallerPhone: user.fakeCallConfig?.defaultCallerPhone ?? "+911234567890",
    ringtoneUrl: user.fakeCallConfig?.ringtoneUrl,
  };
}

export const fakeCallService = {
  async get(userId: string) {
    const user = await UserModel.findById(userId);
    return toConfigDto(user);
  },

  async update(userId: string, input: FakeCallConfigInput) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { fakeCallConfig: input },
      { new: true },
    );

    return toConfigDto(user);
  },
};
