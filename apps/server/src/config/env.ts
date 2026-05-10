import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().default("http://localhost:4000"),
  MOBILE_APP_URL: z.string().url().optional(),
  CLIENT_URL: z.string().url().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  MONGODB_URI: z.string().min(10),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_TEMPLATE_NAME: z.string().default("safety_alert"),
  PROVIDER_MODE: z.enum(["live", "fallback"]).default("fallback"),
  CONTACT_VERIFICATION_BASE_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  ...process.env,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
});

if (!parsed.success) {
  console.error("Invalid server environment", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid server environment");
}

function parseOrigins(value?: string) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

const clientUrl = parsed.data.CLIENT_URL || parsed.data.APP_URL;
const mobileAppUrl = parsed.data.MOBILE_APP_URL || parsed.data.APP_URL;

export const env = {
  ...parsed.data,
  CLIENT_URL: clientUrl,
  MOBILE_APP_URL: mobileAppUrl,
  CORS_ORIGINS: Array.from(
    new Set([parsed.data.APP_URL, clientUrl, mobileAppUrl, ...parseOrigins(parsed.data.ALLOWED_ORIGINS)]),
  ),
};
