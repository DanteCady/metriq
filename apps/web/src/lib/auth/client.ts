"use client";

import { apiKeyClient } from "@better-auth/api-key/client";
import { stripeClient } from "@better-auth/stripe/client";
import {
  adminClient,
  emailOTPClient,
  oneTimeTokenClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  plugins: [
    organizationClient(),
    adminClient(),
    emailOTPClient(),
    oneTimeTokenClient(),
    apiKeyClient(),
    stripeClient({ subscription: true }),
  ],
});
