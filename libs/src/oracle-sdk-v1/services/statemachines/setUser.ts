import { Update } from "../update";
import type Store from "../../store";
import type { Handlers as GenericHandlers } from "../../types/statemachine";
import type { User } from "../../types/state";
import { ignoreExistenceErrorAsync } from "../../errors";

// require exports for a new context handler
export type Params = Partial<User>;
export type Memory = undefined;

export function initMemory(): Memory {
  return undefined;
}

export function Handlers(store: Store): GenericHandlers<Params, Memory> {
  const update = new Update(store);
  return {
    async start(params: Params) {
      store.write((write) => write.inputs().user().set(params));

      // ignore erorrs caused by data not existing on reads, pass through other errors
      await ignoreExistenceErrorAsync(update.userCollateralBalance);
      await ignoreExistenceErrorAsync(update.oracleAllowance);

      return "done";
    },
  };
}
