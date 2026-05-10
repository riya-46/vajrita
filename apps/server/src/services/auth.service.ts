import { addDays } from "./date.service.js";
import { getFirebaseAdmin } from "../config/firebase.js";
import { AppError } from "../utils/AppError.js";
import { sha256 } from "../utils/crypto.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AccessTokenPayload,
} from "../utils/jwt.js";
import { RefreshTokenModel } from "../models/RefreshToken.js";
import { UserModel, type UserDocument } from "../models/User.js";
import type { AuthenticatedUser, SessionTokens } from "@vajrita/shared";

function toUserDto(user: UserDocument | null) {
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return {
    id: user._id.toString(),
    name: user.name,
    phone: user.phone,
    verified: user.verified,
    trustedContactsCount: user.trustedContactsCount,
    createdAt: user.createdAt.toISOString(),
  } satisfies AuthenticatedUser;
}

async function issueTokens(payload: AccessTokenPayload, userAgent?: string) {
  const refreshSession = await RefreshTokenModel.create({
    userId: payload.sub,
    tokenHash: "pending",
    userAgent,
    expiresAt: addDays(new Date(), 30),
  });

  const refreshToken = signRefreshToken({
    sub: payload.sub,
    sid: refreshSession._id.toString(),
    type: "refresh",
  });

  refreshSession.tokenHash = sha256(refreshToken);
  await refreshSession.save();

  const accessToken = signAccessToken(payload);
  return { accessToken, refreshToken } satisfies SessionTokens;
}

export const authService = {
  async exchangeFirebaseToken(firebaseToken: string, preferredName?: string, userAgent?: string) {
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(firebaseToken);
    const phone = decoded.phone_number;

    if (!phone) {
      throw new AppError("Phone number missing from Firebase token", 400, "PHONE_MISSING");
    }

    const fallbackName = preferredName?.trim() || decoded.name?.trim() || `User ${phone.slice(-4)}`;

    const user = await UserModel.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        firebaseUid: decoded.uid,
        phone,
        name: fallbackName,
        verified: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const tokens = await issueTokens(
      {
        sub: user._id.toString(),
        phone: user.phone,
        type: "access",
      },
      userAgent,
    );

    return {
      user: toUserDto(user),
      tokens,
    };
  },

  async refresh(refreshToken: string, userAgent?: string) {
    const payload = verifyRefreshToken(refreshToken);
    const session = await RefreshTokenModel.findOne({
      _id: payload.sid,
      userId: payload.sub,
      revokedAt: null,
    });

    if (!session || session.tokenHash !== sha256(refreshToken) || session.expiresAt <= new Date()) {
      throw new AppError("Refresh token expired", 401, "REFRESH_EXPIRED");
    }

    session.revokedAt = new Date();
    await session.save();

    const user = await UserModel.findById(payload.sub);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const tokens = await issueTokens(
      {
        sub: user._id.toString(),
        phone: user.phone,
        type: "access",
      },
      userAgent,
    );

    return {
      user: toUserDto(user),
      tokens,
    };
  },

  async logout(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await RefreshTokenModel.findOneAndUpdate(
        { _id: payload.sid, userId: payload.sub, revokedAt: null },
        { revokedAt: new Date() },
      );
    } catch {
      return;
    }
  },

  async me(userId: string) {
    const user = await UserModel.findById(userId);
    return toUserDto(user);
  },
};
