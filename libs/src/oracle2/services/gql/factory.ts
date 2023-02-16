import { Service, Handlers, ServiceFactory, OracleType } from "../../types";
import { convertV1, convertAssertion } from "./utils";
import { getRequests as getRequestsV1 } from "./oracleV1";
import { getRequests as getAssertions } from "./asserter";

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
    async function fetchAsserter({ url, chainId }: Omit<GqlConfig, "type">) {
      const assertions = await getAssertions(url);
      return assertions.map((assertion) =>
        convertAssertion(assertion, chainId)
      );
    }
    async function tick() {
      await Promise.all(
        config.map(async (config) => {
          if (handlers.requests && config.type === OracleType.Optimistic) {
            handlers.requests(await fetchV1(config));
          }
          if (handlers.assertions && config.type === OracleType.Asserter) {
            handlers.assertions(await fetchAsserter(config));
          }
          throw new Error(`Unsupported oracle type ${config.type}`);
        })
      );
    }

    return {
      tick,
    };
  };
