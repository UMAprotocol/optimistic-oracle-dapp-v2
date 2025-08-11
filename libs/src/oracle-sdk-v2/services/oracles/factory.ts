import type { ChainId, OracleType } from "@shared/types";
import type { Handlers, Service, ServiceFactory } from "../../types";

// gql1 covers skinny, v1, v2
import { gql as gql1 } from "../oraclev1";
import { gql as gql3 } from "../oraclev3";
import { gql as gqlManaged } from "../managedv2";

export type GqlConfig = {
  source: "gql";
  urls: string[];
  chainId: ChainId;
  type: OracleType;
  address: string;
};
export type Config = GqlConfig[];

export const Factory = (config: Config): ServiceFactory[] => {
  return config.map((config) => {
    return (handlers: Handlers): Service => {
      if (
        config.source === "gql" &&
        (config.type === "Optimistic Oracle V1" ||
          config.type === "Optimistic Oracle V2" ||
          config.type === "Skinny Optimistic Oracle")
      ) {
        return gql1.Factory(config)(handlers);
      }
      if (
        config.source === "gql" &&
        config.type === "Managed Optimistic Oracle V2"
      ) {
        return gqlManaged.Factory(config)(handlers);
      }
      if (config.source === "gql" && config.type === "Optimistic Oracle V3") {
        return gql3.Factory(config)(handlers);
      }
      throw new Error(
        `Unsupported oracle type ${config.type} from ${config.source}`,
      );
    };
  });
};
