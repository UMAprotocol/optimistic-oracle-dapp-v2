import type { ChainId } from "@shared/types";
import { type SendTransactionResult, waitForTransaction } from "@wagmi/core";
import Events from "events";
import uniqueId from "lodash/uniqueId";
import type { ReactNode } from "react";

export const events = new Events();

export function emitSuccessEvent(successEvent: {
  message: ReactNode;
  pendingId: string;
}) {
  const id = uniqueId();
  events.emit("success", { ...successEvent, id });
  return id;
}

export function emitErrorEvent(errorEvent: {
  message: ReactNode;
  pendingId: string;
}) {
  const id = uniqueId();
  events.emit("error", { ...errorEvent, id: uniqueId() });
  return id;
}

export function emitPendingEvent(pendingEvent: {
  message: ReactNode;
  chainId: ChainId;
  transactionHash: string;
}) {
  const id = uniqueId();
  events.emit("pending", { ...pendingEvent, id });
  return id;
}

export async function handleNotifications(
  tx: SendTransactionResult,
  chainId: ChainId,
  messages: { pending: ReactNode; success: ReactNode; error: ReactNode },
) {
  const transactionHash = tx.hash;
  const pendingId = emitPendingEvent({
    message: messages.pending,
    chainId,
    transactionHash,
  });
  try {
    const result = await waitForTransaction(tx);
    emitSuccessEvent({ message: messages.success, pendingId });
    return result;
  } catch (e) {
    emitErrorEvent({ message: messages.error, pendingId });
    throw e;
  }
}
