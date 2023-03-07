import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getAssertions } from "./queries";
import { convert } from "./utils";

export type Config = {
  url: string;
  chainId: number;
  address: string;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address }: Config) {
      const requests = await getAssertions(
        url,
        "Optimistic Oracle V3",
        chainId
      );
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
