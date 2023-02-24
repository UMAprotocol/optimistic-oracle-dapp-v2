import type Store from "../../store";
import type { Inputs } from "../../types/state";
import type { Handlers as GenericHandlers } from "../../types/statemachine";

// required exports for state machine
export type Params = Inputs["request"];
export type Memory = undefined;
export function initMemory(): Memory {
  return undefined;
}
export function Handlers(store: Store): GenericHandlers<Params, Memory> {
  return {
    start(params: Params) {
      store.write((write) => write.inputs().request(params));
      return "done";
    },
  };
}
