/**
 * Better Auth server configuration. Keep plugins aligned with `packages/db/migrations/0007_better_auth.ts`.
 */
import { apiKey } from "@better-auth/api-key";
import { stripe as stripePlugin } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { emailOTP } from "better-auth/plugins/email-otp";
import { oneTimeToken } from "better-auth/plugins/one-time-token";
import { organization } from "better-auth/plugins/organization";
import { getDb } from "@metriq/db";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-only-secret-min-32-characters-long!!",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  database: {
    db: getDb(),
    type: "postgres",
  },
  user: {
    modelName: "auth_user",
  },
  emailAndPassword: { enabled: true },
  plugins: [
    organization(),
    admin(),
    emailOTP({
      sendVerificationOTP: async () => {
        /* Implement via apps/web/src/lib/auth/email.ts when email provider is wired */
      },
    }),
    oneTimeToken(),
    apiKey({
      defaultPrefix: "mq_",
    }),
    stripePlugin({
      stripeClient: new Stripe(stripeSecret),
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_placeholder",
      createCustomerOnSignUp: false,
      organization: {
        enabled: true,
      },
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: process.env.STRIPE_PRICE_STARTER ?? "price_starter_placeholder",
            limits: { maxAuditions: 5 },
          },
          {
            name: "pro",
            priceId: process.env.STRIPE_PRICE_PRO ?? "price_pro_placeholder",
            limits: { maxAuditions: 50, sso: true, apiAccess: true },
          },
          {
            name: "enterprise",
            priceId: process.env.STRIPE_PRICE_ENTERPRISE ?? "price_enterprise_placeholder",
            limits: { maxAuditions: 500, sso: true, apiAccess: true },
          },
        ],
      },
    }),
  ],
});
