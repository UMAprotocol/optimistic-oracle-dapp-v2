import type { ChainId, OracleType } from "@shared/types";
import { parsePriceRequestGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import { getPriceRequestsIncremental } from "./queries";

export type Config = {
  url: string;
  chainId: ChainId;
  address: string;
  type: OracleType;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ url, chainId, address, type }: Config) {
      for await (const requests of getPriceRequestsIncremental(
        url,
        chainId,
        type,
      )) {
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
      }
    }
    async function tick() {
      await fetch(config);
    }

    return {
      tick,
    };
  };
