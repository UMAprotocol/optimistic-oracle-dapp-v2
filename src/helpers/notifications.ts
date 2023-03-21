import Events from "events";
import type { ReactNode } from "react";
import uniqueId from "lodash/uniqueId";
export const events = new Events();

export function emitSuccessEvent(successEvent: {
  message: ReactNode;
  id: string;
}) {
  events.emit("success", { ...successEvent });
}

export function emitErrorEvent(errorEvent: { message: ReactNode; id: string }) {
  events.emit("error", { ...errorEvent });
}

export function emitPendingEvent(pendingEvent: {
  message: ReactNode;
  id: string;
}) {
  events.emit("pending", { ...pendingEvent });
}

export function TransactionNotifier(messages: {
  pending: ReactNode;
  success: ReactNode;
  error: ReactNode;
}) {
  const id = uniqueId();
  return {
    // Function fires before the contract write function and is passed same variables the contract write function would receive.
    onMutate() {
      emitPendingEvent({ message: messages.pending, id });
    },
    // Function to invoke when write is successful.
    onSuccess() {
      emitSuccessEvent({ message: messages.success, id });
    },
    // Function to invoke when an error is thrown while attempting to write.
    onError() {
      emitErrorEvent({ message: messages.error, id });
    },
  };
}
