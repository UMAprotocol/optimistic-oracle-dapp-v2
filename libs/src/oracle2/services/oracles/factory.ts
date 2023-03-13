import type { ChainId, OracleType } from "@shared/types";
import type { Handlers, Service, ServiceFactory } from "../../types";

import { gql as gqlV3 } from "../assertions";
import { gql as gqlV1 } from "../priceRequests";
import { gql as gqlSkinny } from "../oracleSkinny";

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
      if (config.source === "gql" && config.type === "Optimistic Oracle V1") {
        return gqlV1.Factory(config)(handlers);
      }
      // note that v2 queries are essentially the same shape as v1, so we reuse the service
      if (config.source === "gql" && config.type === "Optimistic Oracle V2") {
        return gqlV1.Factory(config)(handlers);
      }
      if (
        config.source === "gql" &&
        config.type === "Skinny Optimistic Oracle"
      ) {
        return gqlSkinny.Factory(config)(handlers);
      }
      if (config.source === "gql" && config.type === "Optimistic Oracle V3") {
        return gqlV3.Factory(config)(handlers);
      }
      throw new Error(
        `Unsupported oracle type ${config.type} from ${config.source}`
      );
    });

    async function tick() {
      await Promise.all(services.map(async (service) => service.tick()));
    }

    return {
      tick,
    };
  };
