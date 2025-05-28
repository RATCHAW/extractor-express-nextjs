import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "@repo/db";
import { env } from "./env";

export const auth = betterAuth({
  baseURL: env.API_BASE_URL,
  trustedOrigins: env.CORS_ORIGINS?.split(",") || [],
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      credits: {
        type: "number",
        required: true,
        defaultValue: 10,
      },
    },
  },
  defaultCookieAttributes: {
    sameSite: "none",
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  logger: {
    level: env.AUTH_DEBUG_LEVEL,
    disabled: env.AUTH_DEBUG_DISABLED,
  },
});
