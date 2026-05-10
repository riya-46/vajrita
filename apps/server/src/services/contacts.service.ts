import mongoose from "mongoose";
import {
  CONTACT_VERIFICATION_TTL_HOURS,
  DEFAULT_EMERGENCY_CONTACTS,
  type ContactCreateInput,
  type ContactUpdateInput,
  type TrustedContactDto,
} from "@vajrita/shared";
import { env } from "../config/env.js";
import { ContactVerificationModel } from "../models/ContactVerification.js";
import { TrustedContactModel, type TrustedContactDocument } from "../models/TrustedContact.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { randomToken, sha256 } from "../utils/crypto.js";
import { addHours } from "./date.service.js";
import { messagingService } from "./messaging.service.js";

function toContactDto(contact: TrustedContactDocument | null) {
  if (!contact) {
    throw new AppError("Contact not found", 404, "CONTACT_NOT_FOUND");
  }

  return {
    id: contact._id.toString(),
    name: contact.name,
    phone: contact.phone,
    relationship: contact.relationship,
    verified: contact.verified,
    isDefault: contact.isDefault,
    createdAt: contact.createdAt.toISOString(),
  } satisfies TrustedContactDto;
}

async function syncContactCount(userId: string) {
  const count = await TrustedContactModel.countDocuments({ userId });
  await UserModel.findByIdAndUpdate(userId, { trustedContactsCount: count });
}

async function ensureDefaultContacts(userId: string) {
  await Promise.all(
    DEFAULT_EMERGENCY_CONTACTS.map((contact) =>
      TrustedContactModel.updateOne(
        { userId, phone: contact.phone },
        {
          $setOnInsert: {
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
            verified: true,
            isDefault: true,
          },
        },
        { upsert: true },
      ),
    ),
  );

  await syncContactCount(userId);
}

export const contactsService = {
  async list(userId: string) {
    await ensureDefaultContacts(userId);
    const contacts = await TrustedContactModel.find({ userId }).sort({ isDefault: -1, createdAt: 1 });
    return contacts.map((item) => toContactDto(item));
  },

  async create(userId: string, input: ContactCreateInput) {
    const contact = await TrustedContactModel.create({
      userId,
      ...input,
      verified: false,
      isDefault: false,
    });

    await syncContactCount(userId);
    return toContactDto(contact);
  },

  async update(userId: string, contactId: string, input: ContactUpdateInput) {
    const contact = await TrustedContactModel.findOne({ _id: contactId, userId });

    if (!contact) {
      throw new AppError("Contact not found", 404, "CONTACT_NOT_FOUND");
    }
    if (contact.isDefault) {
      throw new AppError("Default emergency contacts cannot be edited", 400, "DEFAULT_IMMUTABLE");
    }

    Object.assign(contact, input, { verified: false });
    await contact.save();
    return toContactDto(contact);
  },

  async remove(userId: string, contactId: string) {
    const contact = await TrustedContactModel.findOne({ _id: contactId, userId });
    if (!contact) {
      throw new AppError("Contact not found", 404, "CONTACT_NOT_FOUND");
    }
    if (contact.isDefault) {
      throw new AppError("Default emergency contacts cannot be removed", 400, "DEFAULT_IMMUTABLE");
    }

    await TrustedContactModel.deleteOne({ _id: contactId, userId });
    await ContactVerificationModel.deleteMany({ contactId });
    await syncContactCount(userId);
  },

  async sendVerification(userId: string, contactId: string) {
    const contact = await TrustedContactModel.findOne({ _id: contactId, userId });
    if (!contact) {
      throw new AppError("Contact not found", 404, "CONTACT_NOT_FOUND");
    }
    if (contact.verified) {
      return { contact: toContactDto(contact), verificationLink: null, providerStatus: "already_verified" };
    }

    await ContactVerificationModel.deleteMany({
      contactId: new mongoose.Types.ObjectId(contactId),
      usedAt: null,
    });

    const rawToken = randomToken(24);
    const verification = await ContactVerificationModel.create({
      userId,
      contactId,
      tokenHash: sha256(rawToken),
      expiresAt: addHours(new Date(), CONTACT_VERIFICATION_TTL_HOURS),
    });

    const baseUrl = env.CONTACT_VERIFICATION_BASE_URL || env.APP_URL;
    const verificationLink = `${baseUrl}/public/verify-contact/${rawToken}`;
    const providerResult = await messagingService.sendVerificationLink(
      contact.phone,
      verificationLink,
      contact.name,
    );

    return {
      contact: toContactDto(contact),
      verificationId: verification._id.toString(),
      verificationLink: env.PROVIDER_MODE === "fallback" ? verificationLink : null,
      providerStatus: providerResult.status,
    };
  },

  async verifyByToken(rawToken: string) {
    const verification = await ContactVerificationModel.findOne({
      tokenHash: sha256(rawToken),
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      throw new AppError("Verification link invalid or expired", 400, "VERIFICATION_INVALID");
    }

    verification.usedAt = new Date();
    await verification.save();

    const contact = await TrustedContactModel.findByIdAndUpdate(
      verification.contactId,
      { verified: true },
      { new: true },
    );

    if (!contact) {
      throw new AppError("Contact not found", 404, "CONTACT_NOT_FOUND");
    }

    await syncContactCount(verification.userId.toString());
    return toContactDto(contact);
  },

  async getVerifiedContacts(userId: string, contactIds: string[]) {
    await ensureDefaultContacts(userId);
    const contacts = await TrustedContactModel.find({
      _id: { $in: contactIds.map((id) => new mongoose.Types.ObjectId(id)) },
      userId,
      verified: true,
    });

    if (contacts.length !== contactIds.length) {
      throw new AppError(
        "Only verified contacts can be used for emergency actions",
        400,
        "CONTACTS_NOT_VERIFIED",
      );
    }

    return contacts;
  },
};
