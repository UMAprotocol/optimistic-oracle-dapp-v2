import assert from "assert";
import { SortedRequests } from "./services/sortedRequests";
import type { ClientTable } from "./types/interfaces";
import type { State, PartialConfigTable } from "./types/state";
import { OracleType } from "./types/state";
import type { Emit } from "./store";
import SkinnyFactory from "./skinnyFactory";
import OptimisticFactory from "./optimisticFactory";
import OptimisticV2Factory from "./optimisticV2Factory";

export type PublicEmit = (
  oracleType: OracleType,
  state: State,
  prev: State
) => void;
const EventHandler =
  (oracleType: OracleType, publicEmit: PublicEmit): Emit =>
  (state: State, prev: State) =>
    publicEmit(oracleType, state, prev);

const Factory = (
  configTable: PartialConfigTable,
  emit: PublicEmit
): ClientTable => {
  const sortedRequests = new SortedRequests();
  return Object.fromEntries(
    Object.entries(configTable).map(([oracleType, config]) => {
      assert(config, "requires config for type: " + oracleType);
      switch (oracleType) {
        case OracleType.Optimistic:
          return [
            oracleType,
            OptimisticFactory(
              config,
              EventHandler(oracleType, emit),
              sortedRequests
            ),
          ];
        case OracleType.Skinny:
          return [
            oracleType,
            SkinnyFactory(
              config,
              EventHandler(oracleType, emit),
              sortedRequests
            ),
          ];
        case OracleType.OptimisticV2:
          return [
            oracleType,
            OptimisticV2Factory(
              config,
              EventHandler(oracleType, emit),
              sortedRequests
            ),
          ];
        default:
          throw new Error(`Unknown oracle type: ${oracleType}`);
      }
    })
  );
};

export default Factory;
