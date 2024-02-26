import type { Client } from "./client";
import { factory } from "./client";
import { SkinnyOptimisticOracle } from "./services/skinnyOptimisticOracle";
import { SortedRequests } from "./services/sortedRequests";
import { DefaultConfig, getMulticall2Address } from "./utils";
import { state } from "./types";
import type { Emit } from "./store";

const Factory = (
  config: state.PartialConfig,
  emit: Emit,
  sortedRequests: SortedRequests = new SortedRequests(),
): Client => {
  const fullConfig = DefaultConfig({
    getMulticall2Address,
  })({ ...config }, state.OracleType.Skinny);
  return factory(fullConfig, emit, SkinnyOptimisticOracle, sortedRequests);
};
export default Factory;
