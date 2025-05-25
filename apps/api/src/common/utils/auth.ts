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
});
