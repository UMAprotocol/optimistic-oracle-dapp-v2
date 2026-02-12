import type { ChainId, OracleType } from "@shared/types";
import { parsePriceRequestGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getPriceRequests, getRecentProposals } from "./queries";

export type Config = {
  urls: string[];
  chainId: ChainId;
  address: string;
  type: OracleType;
  enableFastVerifyQuery?: boolean;
  verifyQueryDaysBack?: number;
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

    async function fetchRecentForVerify({
      urls,
      chainId,
      address,
      type,
      verifyQueryDaysBack = 7,
    }: Config) {
      let err;
      for (const url of urls) {
        try {
          const requests = await getRecentProposals(
            url,
            chainId,
            type,
            verifyQueryDaysBack,
          );
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
          console.warn(`Failed to fetch recent proposals from ${url}:`, error);
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
      if (config.enableFastVerifyQuery) {
        // Run fast query first for immediate verify page data
        try {
          await fetchRecentForVerify(config);
        } catch (error) {
          console.warn(
            "Fast verify query failed, falling back to full query:",
            error,
          );
        }
        // Run full query in background (don't await, but handle errors)
        fetch(config).catch((err) => {
          console.warn("Background full query failed:", err);
        });
      } else {
        await fetch(config);
      }
    }

    return {
      tick,
    };
  };
