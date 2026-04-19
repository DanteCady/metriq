"use client";

import * as React from "react";

import { useToast, type ToastTone } from "@metriq/ui";

import { trpc } from "../app/providers";
import { logClientError } from "./client-log";
import { getMetriqCodeFromUnknown, getTrpcUserMessage } from "./trpc-error";

export type NotifySurface = "toast" | "inbox" | "both";

export type NotifyContent = {
  title: string;
  description?: string;
  surface?: NotifySurface;
  /** Stored with server-backed inbox rows (`notification.create`). */
  category?: string;
  linkHref?: string;
};

/**
 * Product notifications: short-lived toasts plus optional durable inbox (top bar) via `notification.create`.
 * Use `fromTrpcError` for API failures so messages and `metriqCode` logging stay consistent.
 */
export function useNotify() {
  const { push: toast } = useToast();
  const utils = trpc.useUtils();
  const createInbox = trpc.notification.create.useMutation({
    onSuccess: async () => {
      await utils.notification.inbox.invalidate();
    },
  });

  const pushToast = React.useCallback(
    (title: string, description: string | undefined, tone: ToastTone) => {
      toast({ title, description, tone });
    },
    [toast],
  );

  const persistInbox = React.useCallback(
    (opts: { title: string; body: string; category: string; linkHref?: string }) => {
      void createInbox.mutate({
        title: opts.title,
        body: opts.body,
        category: opts.category,
        linkHref: opts.linkHref,
      });
    },
    [createInbox],
  );

  const success = React.useCallback(
    ({ title, description, surface = "toast", category = "app.success", linkHref }: NotifyContent) => {
      pushToast(title, description, "success");
      if (surface === "inbox" || surface === "both") {
        persistInbox({ title, body: description ?? "", category, linkHref });
      }
    },
    [pushToast, persistInbox],
  );

  const error = React.useCallback(
    ({ title, description, surface = "toast", category = "app.error", linkHref }: NotifyContent) => {
      logClientError(title, undefined, { description });
      pushToast(title, description, "error");
      if (surface === "inbox" || surface === "both") {
        persistInbox({ title, body: description ?? "", category, linkHref });
      }
    },
    [pushToast, persistInbox],
  );

  const info = React.useCallback(
    ({ title, description, surface = "toast", category = "app.info", linkHref }: NotifyContent) => {
      pushToast(title, description, "default");
      if (surface === "inbox" || surface === "both") {
        persistInbox({ title, body: description ?? "", category, linkHref });
      }
    },
    [pushToast, persistInbox],
  );

  const fromTrpcError = React.useCallback(
    (err: unknown, opts?: { title?: string; fallbackDescription?: string; surface?: NotifySurface }) => {
      const code = getMetriqCodeFromUnknown(err);
      const description = getTrpcUserMessage(err, opts?.fallbackDescription ?? "Request failed");
      const title = opts?.title ?? "Request failed";
      logClientError(title, err, code ? { metriqCode: code } : undefined);
      pushToast(title, description, "error");
      const surface = opts?.surface ?? "toast";
      if (surface === "inbox" || surface === "both") {
        persistInbox({
          title,
          body: code ? `${description} (${code})` : description,
          category: code ?? "app.trpc_error",
        });
      }
    },
    [pushToast, persistInbox],
  );

  return React.useMemo(
    () => ({ success, error, info, fromTrpcError }),
    [success, error, info, fromTrpcError],
  );
}
