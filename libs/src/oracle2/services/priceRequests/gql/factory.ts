import type {
  ChainId,
  OOV1GraphQuery,
  OOV2GraphQuery,
  OracleType,
} from "@shared/types";
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
      const requests = await fetcher(url, chainId, type);
      return requests.map((request) =>
        parsePriceRequestGraphEntity(request, chainId, address, type)
      );
    }
    async function fetcher(url: string, chainId: number, type: OracleType) {
      const isV2 = type === "Optimistic Oracle V2";
      if (isV2) {
        return await getPriceRequests<OOV2GraphQuery>(url, chainId, type);
      }
      return await getPriceRequests<OOV1GraphQuery>(url, chainId, type);
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
