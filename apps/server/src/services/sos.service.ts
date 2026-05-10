import mongoose from "mongoose";
import type { AlertChannel, EmergencySessionDto, EmergencyStartInput } from "@vajrita/shared";
import { env } from "../config/env.js";
import { AlertAttemptModel } from "../models/AlertAttempt.js";
import { EmergencySessionModel, type EmergencySessionDocument } from "../models/EmergencySession.js";
import { TrackingSessionModel } from "../models/TrackingSession.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { emitToUser } from "../sockets/index.js";
import { contactsService } from "./contacts.service.js";
import { messagingService } from "./messaging.service.js";
import { trackingService } from "./tracking.service.js";

function summaryFromAttempts(attempts: { status: string }[]) {
  return attempts.reduce(
    (acc, item) => {
      if (item.status === "sent") acc.sent += 1;
      else if (item.status === "failed") acc.failed += 1;
      else acc.pending += 1;
      return acc;
    },
    { sent: 0, failed: 0, pending: 0 },
  );
}

async function toEmergencyDto(session: EmergencySessionDocument | null) {
  if (!session) {
    throw new AppError("Emergency session not found", 404, "SOS_NOT_FOUND");
  }

  const attempts = await AlertAttemptModel.find({ sessionId: session._id });
  const trackingSession = session.trackingSessionId
    ? await TrackingSessionModel.findById(session.trackingSessionId)
    : null;

  return {
    id: session._id.toString(),
    active: session.active,
    recipients: session.recipients.map((item) => ({
      contactId: item.contactId.toString(),
      name: item.name,
      phone: item.phone,
      relationship: item.relationship,
    })),
    channels: session.channels as AlertChannel[],
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    liveTrackingEnabled: session.liveTrackingEnabled,
    trackingSession: trackingSession
      ? await trackingService.getOwned(session.userId.toString(), trackingSession._id.toString())
      : null,
    alertSummary: summaryFromAttempts(attempts),
  } satisfies EmergencySessionDto;
}

function buildEmergencyMessage(name: string, latitude: number, longitude: number, shareUrl: string) {
  return [
    "EMERGENCY ALERT",
    "",
    `${name} may be in danger.`,
    "",
    `Live Location: https://maps.google.com/?q=${latitude},${longitude}`,
    "",
    `Live tracking has started: ${shareUrl}`,
  ].join("\n");
}

async function sendAttempts(
  sessionId: string,
  channels: AlertChannel[],
  recipients: { phone: string; name: string }[],
  message: string,
) {
  const attempts = [];

  for (const recipient of recipients) {
    for (const channel of channels) {
      if (channel === "call") {
        continue;
      }

      const result = await messagingService.sendAlert(channel, recipient.phone, message, recipient.name);
      const attempt = await AlertAttemptModel.create({
        sessionId,
        channel,
        recipientPhone: recipient.phone,
        providerMessageId: result.providerMessageId ?? null,
        status: result.status,
        errorCode: result.errorCode ?? null,
      });

      attempts.push(attempt);
    }
  }

  return attempts;
}

export const sosService = {
  async start(userId: string, input: EmergencyStartInput) {
    const existing = await EmergencySessionModel.findOne({ userId, active: true });
    if (existing) {
      throw new AppError("An emergency session is already active", 409, "SOS_ALREADY_ACTIVE");
    }

    const [user, contacts] = await Promise.all([
      UserModel.findById(userId),
      contactsService.getVerifiedContacts(userId, input.contactIds),
    ]);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    const trackingSession = await trackingService.createSession(userId, {
      contactIds: input.contactIds,
      duration: input.trackingDuration,
      initialLocation: input.initialLocation,
    });

    const session = await EmergencySessionModel.create({
      userId,
      active: true,
      recipients: contacts.map((contact) => ({
        contactId: contact._id,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
      })),
      channels: input.channels,
      startedAt: new Date(),
      liveTrackingEnabled: true,
      trackingSessionId: new mongoose.Types.ObjectId(trackingSession.id),
    });

    const message = buildEmergencyMessage(
      user.name,
      input.initialLocation.latitude,
      input.initialLocation.longitude,
      trackingSession.shareUrl,
    );

    await sendAttempts(
      session._id.toString(),
      input.channels,
      contacts.map((contact) => ({ phone: contact.phone, name: contact.name })),
      message,
    );

    const dto = await toEmergencyDto(session);
    emitToUser(userId, "sos:started", dto);
    return dto;
  },

  async active(userId: string) {
    const session = await EmergencySessionModel.findOne({ userId, active: true });
    return session ? toEmergencyDto(session) : null;
  },

  async retry(userId: string, sessionId: string, attemptIds?: string[]) {
    const session = await EmergencySessionModel.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new AppError("Emergency session not found", 404, "SOS_NOT_FOUND");
    }

    const attempts = await AlertAttemptModel.find({
      sessionId,
      status: "failed",
      ...(attemptIds?.length ? { _id: { $in: attemptIds.map((id) => new mongoose.Types.ObjectId(id)) } } : {}),
    });

    const trackingSession = session.trackingSessionId
      ? await TrackingSessionModel.findById(session.trackingSessionId)
      : null;

    const user = await UserModel.findById(userId);
    if (!user || !trackingSession?.lastLocation) {
      throw new AppError("Session not ready for retry", 400, "SOS_RETRY_UNAVAILABLE");
    }

    const message = buildEmergencyMessage(
      user.name,
      trackingSession.lastLocation.latitude,
      trackingSession.lastLocation.longitude,
      `${env.APP_URL}/public/track/${trackingSession.shareToken}`,
    );

    for (const attempt of attempts) {
      const result = await messagingService.sendAlert(
        attempt.channel as Exclude<AlertChannel, "call">,
        attempt.recipientPhone,
        message,
        user.name,
      );
      attempt.status = result.status;
      attempt.providerMessageId = result.providerMessageId ?? attempt.providerMessageId;
      attempt.errorCode = result.errorCode ?? null;
      await attempt.save();
    }

    return toEmergencyDto(session);
  },

  async end(userId: string, sessionId: string) {
    const session = await EmergencySessionModel.findOneAndUpdate(
      { _id: sessionId, userId, active: true },
      { active: false, endedAt: new Date(), liveTrackingEnabled: false },
      { new: true },
    );

    if (!session) {
      throw new AppError("Emergency session not found", 404, "SOS_NOT_FOUND");
    }

    if (session.trackingSessionId) {
      await trackingService.stop(userId, session.trackingSessionId.toString()).catch(() => undefined);
    }

    const dto = await toEmergencyDto(session);
    emitToUser(userId, "sos:ended", dto);
    return dto;
  },
};
