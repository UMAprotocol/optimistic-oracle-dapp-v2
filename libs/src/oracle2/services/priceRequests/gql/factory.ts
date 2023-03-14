import type { ChainId, OracleType } from "@shared/types";
import { parsePriceRequestGraphEntity } from "@shared/utils";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getPriceRequests } from "./queries";

export type Config = {
  url: string;
  chainId: ChainId;
  address: string;
  type: OracleType;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address, type }: Config) {
      const requests = await getPriceRequests(url, chainId, type);
      return requests.map((request) =>
        parsePriceRequestGraphEntity(request, chainId, address, type)
      );
    }
    async function tick() {
      if (handlers.requests) {
        handlers.requests(await fetch(config));
      }
    }

    return {
      tick,
    };
  };
