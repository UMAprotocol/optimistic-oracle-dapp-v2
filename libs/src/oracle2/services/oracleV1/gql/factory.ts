import type {
  Service,
  Handlers,
  ServiceFactory,
  OracleType,
} from "../../../types";
import { convert } from "./utils";
import { getRequests } from "./queries";

export type Config = {
  url: string;
  chainId: number;
  address: string;
  type: OracleType;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address, type }: Config) {
      const requests = await getRequests(url);
      return requests.map((request) =>
        convert(request, chainId, address, type)
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
