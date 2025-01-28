import type { ChainId, OracleType } from "@shared/types";
import { parsePriceRequestGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getPriceRequests } from "./queries";

export type Config = {
  urls: string[];
  chainId: ChainId;
  address: string;
  type: OracleType;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ urls, chainId, address, type }: Config) {
      let err;
      for (const url of urls) {
        try {
          const requests = await getPriceRequests(url, chainId, type);
          handlers?.requests?.(
            requests.map((request) =>
              parsePriceRequestGraphEntity(
                request,
                chainId,
                address as Address,
                type,
              ),
            ),
          );
          return;
        } catch (error) {
          err = error;
          console.warn(`Failed to fetch from ${url}:`, error);
        }
      }
      throw err;
    }
    // if we need to bring back incremental loading
    // async function fetchIncremental({ url, chainId, address, type }: Config) {
    //   for await (const requests of getPriceRequestsIncremental(
    //     url,
    //     chainId,
    //     type,
    //   )) {
    //     handlers?.requests?.(
    //       requests.map((request) =>
    //         parsePriceRequestGraphEntity(
    //           request,
    //           chainId,
    //           address as Address,
    //           type,
    //         ),
    //       ),
    //     );
    //   }
    // }
    async function tick() {
      await fetch(config);
    }

    return {
      tick,
    };
  };
