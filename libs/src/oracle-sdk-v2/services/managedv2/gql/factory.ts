import type { ChainId, OOV2GraphEntity, OracleType } from "@shared/types";
import { parsePriceRequestGraphEntity } from "@shared/utils";
import type { Address } from "wagmi";
import type { Handlers, Service, ServiceFactory } from "../../../types";
import {
  getPriceRequests,
  getCustomBondForRequest,
  getCustomLivenessForRequest,
} from "./queries";

export type Config = {
  urls: string[];
  chainId: ChainId;
  address: string;
  type: OracleType;
};

export const Factory =
  (config: Config): ServiceFactory =>
  (handlers: Handlers): Service => {
    async function fetch({ urls, chainId, address, type }: Config) {
      let err;
      for (const url of urls) {
        try {
          const requests = (await getPriceRequests(
            url,
            chainId,
            type,
          )) as OOV2GraphEntity[];

          // For each request, fetch the corresponding CustomBond and CustomLiveness entities
          const enhancedRequests = await Promise.all(
            requests.map(async (request) => {
              console.log(
                "Fetching custom bond and liveness for request with data",
                {
                  requester: request.requester,
                  identifier: request.identifier,
                  ancillaryData: request.ancillaryData,
                },
              );
              // Fetch custom bond and liveness data for this specific request using raw values
              const [customBond, customLiveness] = await Promise.all([
                getCustomBondForRequest(
                  url,
                  request.requester,
                  request.identifier,
                  request.ancillaryData,
                ),
                getCustomLivenessForRequest(
                  url,
                  request.requester,
                  request.identifier,
                  request.ancillaryData,
                ),
              ]);

              // Create enhanced raw request with custom bond and liveness data
              // Only add customLiveness and bond if this is an OOV2GraphEntity
              const enhancedRequest = {
                ...request,
                customLiveness: customLiveness?.customLiveness?.toString(),
                bond: customBond?.customBond
                  ? customBond.customBond
                  : request.bond,
              };

              return enhancedRequest;
            }),
          );

          // Parse the enhanced requests using handlers
          handlers.requests?.(
            enhancedRequests.map((request) =>
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
      await fetch(config);
    }

    return {
      tick,
    };
  };
