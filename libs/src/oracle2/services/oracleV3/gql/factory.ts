import type { Service, Handlers, ServiceFactory } from "../../../types";
import { convert } from "./utils";
import { getRequests } from "./queries";

export type Config = {
  url: string;
  chainId: number;
  address: string;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address }: Config) {
      const requests = await getRequests(url);
      return requests.map((request) => convert(request, chainId, address));
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
