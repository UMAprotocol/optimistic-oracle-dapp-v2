import type { ChainId, OracleType } from "@shared/types";
import type { Handlers, Service, ServiceFactory } from "../../types";

import { gql as gqlAssertions } from "../assertions";
import { gql as gqlPriceRequests } from "../priceRequests";

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
        return gqlPriceRequests.Factory(config)(handlers);
      }
      if (config.source === "gql" && config.type === "Optimistic Oracle V3") {
        return gqlAssertions.Factory(config)(handlers);
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
