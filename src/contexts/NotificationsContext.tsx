import { events } from "@/helpers";
import type {
  Notification,
  PendingNotification,
  SettledEvent,
  UniqueId,
} from "@/types";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

export type NotificationsById = Record<UniqueId, Notification | undefined>;

export interface NotificationsContextState {
  notifications: NotificationsById;
  removeNotification: (id: UniqueId) => void;
  clearNotifications: () => void;
}

export const defaultNotificationsContextState: NotificationsContextState = {
  notifications: {},
  removeNotification: () => null,
  clearNotifications: () => null,
};

export const NotificationsContext = createContext(
  defaultNotificationsContextState,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationsById>({});

  useEffect(() => {
    function handlePendingEvent({
      message,
      id,
      chainId,
      transactionHash,
    }: PendingNotification) {
      addNotification({
        id,
        message,
        chainId,
        transactionHash,
        type: "pending",
      });
    }

    function handleSuccessEvent({ message, pendingId }: SettledEvent) {
      updatePendingNotification(pendingId, message, "success");

      setTimeout(() => {
        removeNotification(pendingId);
      }, 5000);
    }

    function handleErrorEvent({ message, pendingId }: SettledEvent) {
      updatePendingNotification(pendingId, message, "error");

      setTimeout(() => {
        removeNotification(pendingId);
      }, 5000);
    }

    events.on("success", handleSuccessEvent);
    events.on("error", handleErrorEvent);
    events.on("pending", handlePendingEvent);

    return () => {
      events.removeListener("success", handleSuccessEvent);
      events.removeListener("error", handleErrorEvent);
      events.removeListener("pending", handlePendingEvent);
    };
  }, []);

  function addNotification(notification: Notification) {
    setNotifications((prev) => ({ ...prev, [notification.id]: notification }));
  }

  function updatePendingNotification(
    id: UniqueId,
    message: ReactNode,
    type: "success" | "error",
  ) {
    setNotifications((prev) => ({
      ...prev,
      [id]: {
        message,
        type,
        id,
        chainId: prev[id]?.chainId,
        transactionHash: prev[id]?.transactionHash,
      },
    }));
  }

  function clearNotifications() {
    setNotifications({});
  }

  function removeNotification(id: UniqueId) {
    setNotifications((prev) => ({ ...prev, [id]: undefined }));
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
