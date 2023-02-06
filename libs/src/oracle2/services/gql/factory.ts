import { Service, Handlers, ServiceFactory, OracleType } from "../../types";
import { convertV1 } from "./utils";
import { getRequests as getRequestsV1 } from "./oracleV1";

export type GqlConfig = {
  url: string;
  chainId: number;
  type: OracleType;
};
export type Config = GqlConfig[];

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetchV1({ url, chainId }: Omit<GqlConfig, "type">) {
      const requests = await getRequestsV1(url);
      return requests.map((request) => convertV1(request, chainId));
    }
    async function tickRequests() {
      const results = await Promise.all(
        config.map((config) => {
          if (config.type === OracleType.Optimistic) {
            return fetchV1(config);
          }
          throw new Error(`Unsupported oracle type ${config.type}`);
        })
      );
      return results.flat();
    }
    async function tick() {
      if (handlers.requests) {
        const result = await tickRequests();
        handlers.requests(result);
      }
    }

    return {
      tick,
    };
  };
