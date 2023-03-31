import type { Client } from "./client";
import { factory } from "./client";
import { OptimisticOracle } from "./services/optimisticOracle";
import { SortedRequests } from "./services/sortedRequests";
import { DefaultConfig, getMulticall2Address } from "./utils";
import { state } from "./types";
import type { Emit } from "./store";

const Factory = (
  config: state.PartialConfig,
  emit: Emit,
  sortedRequests: SortedRequests = new SortedRequests()
): Client => {
  const fullConfig = DefaultConfig({
    getMulticall2Address,
  })({ ...config }, state.OracleType.Optimistic);
  return factory(fullConfig, emit, OptimisticOracle, sortedRequests);
};
export default Factory;
