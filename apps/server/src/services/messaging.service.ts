import axios from "axios";
import Twilio from "twilio";
import type { AlertChannel } from "@vajrita/shared";
import { env } from "../config/env.js";

export type MessageResult = {
  status: "sent" | "failed";
  providerMessageId?: string | null;
  errorCode?: string | null;
};

const twilioClient =
  env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN
    ? Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
    : null;

async function fallbackLog(kind: string, target: string, payload: unknown): Promise<MessageResult> {
  console.log(`[${kind}]`, target, payload);
  return {
    status: "sent",
    providerMessageId: `fallback-${Date.now()}`,
    errorCode: null,
  };
}

export const messagingService = {
  async sendVerificationLink(phone: string, link: string, name: string): Promise<MessageResult> {
    const body = `Hi ${name}, tap to verify yourself as a trusted contact on VAJRITA: ${link}`;

    if (env.PROVIDER_MODE === "fallback" || !twilioClient || !env.TWILIO_FROM_NUMBER) {
      return fallbackLog("verification-sms", phone, { body });
    }

    try {
      const response = await twilioClient.messages.create({
        body,
        from: env.TWILIO_FROM_NUMBER,
        to: phone,
      });

      return { status: "sent", providerMessageId: response.sid };
    } catch (error) {
      return { status: "failed", errorCode: error instanceof Error ? error.message : "SMS_FAILED" };
    }
  },

  async sendAlert(
    channel: Exclude<AlertChannel, "call">,
    phone: string,
    message: string,
    name: string,
  ): Promise<MessageResult> {
    if (channel === "sms") {
      if (env.PROVIDER_MODE === "fallback" || !twilioClient || !env.TWILIO_FROM_NUMBER) {
        return fallbackLog("sos-sms", phone, { message });
      }

      try {
        const response = await twilioClient.messages.create({
          body: message,
          from: env.TWILIO_FROM_NUMBER,
          to: phone,
        });

        return { status: "sent", providerMessageId: response.sid } satisfies MessageResult;
      } catch (error) {
        return {
          status: "failed",
          errorCode: error instanceof Error ? error.message : "SMS_FAILED",
        } satisfies MessageResult;
      }
    }

    if (
      env.PROVIDER_MODE === "fallback" ||
      !env.WHATSAPP_ACCESS_TOKEN ||
      !env.WHATSAPP_PHONE_NUMBER_ID
    ) {
      return fallbackLog("sos-whatsapp", phone, { message, name });
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v23.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: env.WHATSAPP_TEMPLATE_NAME,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: message },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        status: "sent",
        providerMessageId: response.data?.messages?.[0]?.id ?? `wa-${Date.now()}`,
      } satisfies MessageResult;
    } catch (error) {
      return {
        status: "failed",
        errorCode: error instanceof Error ? error.message : "WHATSAPP_FAILED",
      } satisfies MessageResult;
    }
  },
};
