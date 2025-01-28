import type { ChainId } from "@shared/types";
import { parseAssertionGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getAssertions } from "./queries";

export type Config = {
  urls: string[];
  chainId: ChainId;
  address: string;
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
    async function tick() {
      if (handlers.assertions) {
        handlers.assertions(await fetch(config));
      }
    }

    return {
      tick,
    };
  };
