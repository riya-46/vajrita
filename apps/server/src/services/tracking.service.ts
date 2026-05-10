import mongoose from "mongoose";
import type {
  LocationPointInput,
  TrackingDuration,
  TrackingSessionDto,
  TrackingStartInput,
} from "@vajrita/shared";
import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { LocationPointModel } from "../models/LocationPoint.js";
import { TrackingSessionModel } from "../models/TrackingSession.js";
import { AppError } from "../utils/AppError.js";
import { emitToTrack, emitToUser } from "../sockets/index.js";
import { addMinutes } from "./date.service.js";
import { contactsService } from "./contacts.service.js";

function durationToExpiry(duration: TrackingDuration) {
  if (duration === "15m") {
    return addMinutes(new Date(), 15);
  }
  if (duration === "1h") {
    return addMinutes(new Date(), 60);
  }
  return null;
}

function toTrackingDto(session: Awaited<ReturnType<typeof TrackingSessionModel.findById>>) {
  if (!session) {
    throw new AppError("Tracking session not found", 404, "TRACKING_NOT_FOUND");
  }

  return {
    id: session._id.toString(),
    shareToken: session.shareToken,
    userId: session.userId.toString(),
    active: session.active,
    duration: session.duration,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    expiresAt: session.expiresAt?.toISOString() ?? null,
    lastLocation: session.lastLocation
      ? {
          latitude: session.lastLocation.latitude,
          longitude: session.lastLocation.longitude,
          accuracy: session.lastLocation.accuracy,
          speed: session.lastLocation.speed,
          heading: session.lastLocation.heading,
          timestamp: session.lastLocation.timestamp.toISOString(),
        }
      : null,
    shareUrl: `${env.APP_URL}/public/track/${session.shareToken}`,
  } satisfies TrackingSessionDto;
}

async function persistPoint(
  trackingSessionId: mongoose.Types.ObjectId | string,
  location: LocationPointInput,
) {
  await LocationPointModel.create({
    trackingSessionId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    speed: location.speed,
    heading: location.heading,
    timestamp: location.timestamp,
  });
}

async function deactivateExisting(userId: string) {
  await TrackingSessionModel.updateMany(
    { userId, active: true },
    { active: false, endedAt: new Date() },
  );
}

export const trackingService = {
  async createSession(userId: string, input: TrackingStartInput) {
    await contactsService.getVerifiedContacts(userId, input.contactIds);
    await deactivateExisting(userId);

    const shareToken = nanoid(24);
    const session = await TrackingSessionModel.create({
      userId,
      shareToken,
      active: true,
      duration: input.duration,
      startedAt: new Date(),
      expiresAt: durationToExpiry(input.duration),
      recipients: input.contactIds.map((id) => new mongoose.Types.ObjectId(id)),
      lastLocation: input.initialLocation,
    });

    await persistPoint(session._id, input.initialLocation);
    const dto = toTrackingDto(session);
    emitToUser(userId, "tracking:started", dto);
    return dto;
  },

  async ping(userId: string, trackingId: string, location: LocationPointInput) {
    const session = await TrackingSessionModel.findOne({ _id: trackingId, userId, active: true });
    if (!session) {
      throw new AppError("Tracking session not found", 404, "TRACKING_NOT_FOUND");
    }

    if (session.expiresAt && session.expiresAt <= new Date()) {
      session.active = false;
      session.endedAt = new Date();
      await session.save();
      throw new AppError("Tracking session expired", 410, "TRACKING_EXPIRED");
    }

    session.lastLocation = location;
    await session.save();
    await persistPoint(session._id, location);

    const dto = toTrackingDto(session);
    emitToUser(userId, "tracking:update", dto);
    emitToTrack(session.shareToken, "tracking:update", dto);
    return dto;
  },

  async stop(userId: string, trackingId: string) {
    const session = await TrackingSessionModel.findOneAndUpdate(
      { _id: trackingId, userId, active: true },
      { active: false, endedAt: new Date() },
      { new: true },
    );
    if (!session) {
      throw new AppError("Tracking session not found", 404, "TRACKING_NOT_FOUND");
    }

    const dto = toTrackingDto(session);
    emitToUser(userId, "tracking:stopped", dto);
    emitToTrack(session.shareToken, "tracking:stopped", dto);
    return dto;
  },

  async getOwned(userId: string, trackingId: string) {
    const session = await TrackingSessionModel.findOne({ _id: trackingId, userId });
    return toTrackingDto(session);
  },

  async getActive(userId: string) {
    const session = await TrackingSessionModel.findOne({ userId, active: true }).sort({ createdAt: -1 });
    return session ? toTrackingDto(session) : null;
  },

  async getPublic(shareToken: string) {
    const session = await TrackingSessionModel.findOne({ shareToken });
    if (!session) {
      throw new AppError("Tracking link invalid", 404, "TRACKING_NOT_FOUND");
    }
    return toTrackingDto(session);
  },
};
