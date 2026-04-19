"use client";

import * as React from "react";

import { trpc } from "../app/providers";

export type AppNotificationItem = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  read: boolean;
  linkHref: string | null;
};

type AppNotificationsContextValue = {
  /** True after the first inbox fetch settles (success or error). */
  ready: boolean;
  items: AppNotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const AppNotificationsContext = React.createContext<AppNotificationsContextValue | null>(null);

export function AppNotificationProvider({ children }: { children: React.ReactNode }) {
  const utils = trpc.useUtils();
  const inboxQuery = trpc.notification.inbox.useQuery(
    { limit: 50 },
    { staleTime: 30_000, refetchOnWindowFocus: true },
  );

  const markReadMut = trpc.notification.markRead.useMutation({
    onSuccess: async () => {
      await utils.notification.inbox.invalidate();
    },
  });

  const markAllMut = trpc.notification.markAllRead.useMutation({
    onSuccess: async () => {
      await utils.notification.inbox.invalidate();
    },
  });

  const items = React.useMemo((): AppNotificationItem[] => {
    if (!inboxQuery.data) return [];
    return inboxQuery.data.items.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      category: row.category,
      createdAt: row.createdAt,
      read: row.read,
      linkHref: row.linkHref,
    }));
  }, [inboxQuery.data]);

  const markRead = React.useCallback(
    (id: string) => {
      markReadMut.mutate({ id });
    },
    [markReadMut],
  );

  const markAllRead = React.useCallback(() => {
    markAllMut.mutate();
  }, [markAllMut]);

  const ready = inboxQuery.isFetched;
  const unreadCount = inboxQuery.data?.unreadCount ?? 0;

  const value = React.useMemo<AppNotificationsContextValue>(
    () => ({
      ready,
      items,
      unreadCount,
      markRead,
      markAllRead,
    }),
    [ready, items, unreadCount, markRead, markAllRead],
  );

  return <AppNotificationsContext.Provider value={value}>{children}</AppNotificationsContext.Provider>;
}

export function useAppNotifications() {
  const ctx = React.useContext(AppNotificationsContext);
  if (!ctx) {
    throw new Error("useAppNotifications must be used within AppNotificationProvider");
  }
  return ctx;
}
