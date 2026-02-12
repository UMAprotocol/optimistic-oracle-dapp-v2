import type { ChainId } from "@shared/types";
import { parseAssertionGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getAssertions, getRecentAssertions } from "./queries";

export type Config = {
  urls: string[];
  chainId: ChainId;
  address: string;
  enableFastVerifyQuery?: boolean;
  verifyQueryDaysBack?: number;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ urls, chainId, address }: Config) {
      let err;
      for (const url of urls) {
        try {
          const requests = await getAssertions(url, chainId);
          return requests.map((request) =>
            parseAssertionGraphEntity(request, chainId, address as Address),
          );
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
      verifyQueryDaysBack = 7,
    }: Config) {
      let err;
      for (const url of urls) {
        try {
          const assertions = await getRecentAssertions(
            url,
            chainId,
            verifyQueryDaysBack,
          );
          handlers?.assertions?.(
            assertions.map((assertion) =>
              parseAssertionGraphEntity(assertion, chainId, address as Address),
            ),
          );
          return;
        } catch (error) {
          err = error;
          console.warn(`Failed to fetch recent assertions from ${url}:`, error);
        }
      }
      throw err;
    }

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
        if (handlers.assertions) {
          fetch(config)
            .then((assertions) => handlers.assertions?.(assertions))
            .catch((err) => {
              console.warn("Background full query failed:", err);
            });
        }
      } else {
        if (handlers.assertions) {
          handlers.assertions(await fetch(config));
        }
      }
    }

    return {
      tick,
    };
  };
