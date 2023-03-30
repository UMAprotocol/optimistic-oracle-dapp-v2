import type { ChainId, OracleType } from "@shared/types";
import type { Handlers, Service, ServiceFactory } from "../../types";

// gql1 covers skinny, v1, v2
import { gql as gql1 } from "../oraclev1";
import { gql as gql3 } from "../oraclev3";

export type GqlConfig = {
  source: "gql";
  url: string;
  chainId: ChainId;
  type: OracleType;
  address: string;
};
export type Config = GqlConfig[];

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    const services: Service[] = config.map((config) => {
      if (
        config.source === "gql" &&
        (config.type === "Optimistic Oracle V1" ||
          config.type === "Optimistic Oracle V2" ||
          config.type === "Skinny Optimistic Oracle")
      ) {
        return gql1.Factory(config)(handlers);
      }
      if (config.source === "gql" && config.type === "Optimistic Oracle V3") {
        return gql3.Factory(config)(handlers);
      }
      throw new Error(
        `Unsupported oracle type ${config.type} from ${config.source}`
      );
    });

    async function tick() {
      await Promise.all(
        services.map(async (service) => (service ? service.tick() : undefined))
      );
    }

    return {
      tick,
    };
  };
