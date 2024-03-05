import type { ChainId } from "@shared/types";
import { parseAssertionGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getAssertions } from "./queries";

export type Config = {
  url: string;
  chainId: ChainId;
  address: string;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address }: Config) {
      const requests = await getAssertions(url, chainId);
      return requests.map((request) =>
        parseAssertionGraphEntity(request, chainId, address as Address),
      );
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
