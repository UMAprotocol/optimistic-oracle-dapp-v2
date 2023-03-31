import type Store from "../../store";
import type { Handlers as GenericHandlers } from "../../types/statemachine";

// require exports for a new context handler
export type Params = undefined;
export type Memory = undefined;

export function initMemory(): Memory {
  return undefined;
}

export function Handlers(store: Store): GenericHandlers<Params, Memory> {
  return {
    start() {
      store.write((write) => {
        write.inputs().user().clear();
      });
      return "done";
    },
  };
}
